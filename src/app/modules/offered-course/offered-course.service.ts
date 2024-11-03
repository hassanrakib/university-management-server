import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semester-registration/semester-registration.model';
import { TOfferedCourse, TSchedule } from './offered-course.interface';
import { OfferedCourse } from './offered-course.model';
import { AcademicDepartment } from '../academic-department/academic-department.model';
import { AcademicFaculty } from '../academic-faculty/academic-faculty.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offered-course.utils';
import { Status } from '../semester-registration/semester-registration.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { Student } from '../student/student.model';

const getOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCoursesQuery = new QueryBuilder(OfferedCourse.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await offeredCoursesQuery.countTotal();
    const result = await OfferedCourse.find();

    return {
        meta,
        result,
    };
};

const getMyOfferedCoursesFromDB = async (
    userId: string,
    query: Record<string, unknown>
) => {
    // pagination information
    const page = Number(query.page as string) || 1;
    const limit = Number(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ id: userId });

    // find the student
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student is not found');
    }

    // get the current ongoing semester
    const ongoingSemesterRegistration = await SemesterRegistration.findOne({
        status: Status.ONGOING,
    });

    if (!ongoingSemesterRegistration) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'There is no semester registration on going!'
        );
    }

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: ongoingSemesterRegistration._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    ongoingSemesterRegistration:
                        ongoingSemesterRegistration._id,
                    studentId: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            '$semesterRegistration',
                                            '$$ongoingSemesterRegistration',
                                        ],
                                    },
                                    {
                                        $eq: ['$student', '$$studentId'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    studentId: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$studentId'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'completedCourses',
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completedCourse',
                        in: '$$completedCourse.course',
                    },
                },
            },
        },
        {
            $addFields: {
                isPreRequisitesFulfilled: {
                    $or: [
                        {
                            $eq: ['$course.preRequisiteCourses', []],
                        },
                        {
                            $setIsSubset: [
                                '$course.preRequisiteCourses.course',
                                '$completedCourseIds',
                            ],
                        },
                    ],
                },
                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll',
                                in: '$$enroll.course',
                            },
                        },
                    ],
                },
            },
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulfilled: true,
            },
        },
    ];
    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];

    const result = await OfferedCourse.aggregate([...aggregationQuery, ...paginationQuery]);

    const total = (await OfferedCourse.aggregate(aggregationQuery)).length;
    const totalPage = Math.ceil(total / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    };
};

const getOfferedCourseByIdFromDB = async (id: string) => {
    return await OfferedCourse.findById(id);
};

const createOfferedCourseIntoDB = async (offeredCourse: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicDepartment,
        academicFaculty,
        course,
        faculty,
        section,
        days,
        startTime,
        endTime,
    } = offeredCourse;

    // check semesterRegistration existence
    const isSemesterRegistrationExist =
        await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester registration not found!'
        );
    }

    // extract the academic semester from the isSemesterRegistrationExist
    const academicSemester = isSemesterRegistrationExist.academicSemester;

    // check academicDepartment existence
    const isAcademicDepartmentExist =
        await AcademicDepartment.findById(academicDepartment);

    if (!isAcademicDepartmentExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Academic department not found!'
        );
    }

    // check academicFaculty existence
    const isAcademicFacultyExist =
        await AcademicFaculty.findById(academicFaculty);

    if (!isAcademicFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found!');
    }

    // check course existence
    const isCourseExist = await Course.findById(course);

    if (!isCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found!');
    }

    // check faculty existence
    const isFacultyExist = await Faculty.findById(faculty);

    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
    }

    // check if the provided academicDepartment belongs to the provided academicDepartment
    if (!isAcademicDepartmentExist.academicFaculty.equals(academicFaculty)) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            `${isAcademicDepartmentExist.name} doesn't belong to ${isAcademicFacultyExist.name}`
        );
    }

    // check if same course with same section with same semester registration is already offered
    const isSameCourseWithSameSectionWithSameSemesterRegistrationOffered =
        await OfferedCourse.findOne({
            semesterRegistration,
            course,
            section,
        });

    if (isSameCourseWithSameSectionWithSameSemesterRegistrationOffered) {
        throw new AppError(
            httpStatus.CONFLICT,
            'Offered course already exists with the same section within same semester registration'
        );
    }

    // get the schedules assigned to the faculty for the same semesterRegistration and same days
    const assignedSchedulesToTheFaculty = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedulesToTheFaculty, newSchedule)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `The time shcedule for the days is not available for the faculty`
        );
    }

    return await OfferedCourse.create({ ...offeredCourse, academicSemester });
};

const updateOfferedCourseIntoDB = async (
    id: string,
    offeredCourseDocPart: Partial<TOfferedCourse>
) => {
    const { faculty, days, startTime, endTime } = offeredCourseDocPart;

    // check offeredCourse existence
    const isOfferedCourseExist = await OfferedCourse.findById(id);

    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
    }

    // check faculty existence
    const isFacultyExist = await Faculty.findById(faculty);

    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
    }

    const semesterRegistrationDoc = await SemesterRegistration.findById(
        isOfferedCourseExist.semesterRegistration
    ).select('status');

    if (semesterRegistrationDoc?.status !== Status.UPCOMING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Can not update the offered course as it's semesterRegistration ${semesterRegistrationDoc?.status}`
        );
    }

    // get the schedules assigned to the faculty for the same semesterRegistration and same days
    const assignedSchedulesToTheFaculty = await OfferedCourse.find({
        semesterRegistration: isOfferedCourseExist.semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (
        hasTimeConflict(assignedSchedulesToTheFaculty, newSchedule as TSchedule)
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `The time shcedule for the days is not available for the faculty`
        );
    }

    return await OfferedCourse.findByIdAndUpdate(id, offeredCourseDocPart, {
        new: true,
        runValidators: true,
    });
};

const deleteOfferedCourseByIdFromDB = async (id: string) => {
    // check offeredCourse existence
    const isOfferedCourseExist = await OfferedCourse.findById(id);

    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
    }

    const semesterRegistrationDoc = await SemesterRegistration.findById(
        isOfferedCourseExist.semesterRegistration
    ).select('status');

    if (semesterRegistrationDoc?.status !== Status.UPCOMING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Can not delete the offered course as it's semesterRegistration ${semesterRegistrationDoc?.status}`
        );
    }

    return await OfferedCourse.findByIdAndDelete(id);
};

export const OfferedCourseServices = {
    getOfferedCoursesFromDB,
    getMyOfferedCoursesFromDB,
    getOfferedCourseByIdFromDB,
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseByIdFromDB,
};
