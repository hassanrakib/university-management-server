import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offered-course/offered-course.model';
import { TEnrolledCourse } from './enrolled-course.interface';
import EnrolledCourse from './enrolled-course.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semester-registration/semester-registration.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolled-course.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const insertEnrolledCourseIntoDB = async (
    userId: string,
    enrolledCourse: TEnrolledCourse
) => {
    // check if offeredCourse exists in db
    const offeredCourse = await OfferedCourse.findById(
        enrolledCourse.offeredCourse
    );

    if (!offeredCourse) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Offered course doesnot exist!'
        );
    }

    // check if offered course's max capcity not become 0
    if (offeredCourse.maxCapacity === 0) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            'No more student can enroll!'
        );
    }

    // get the student by custom user id
    const student = await Student.findOne({ id: userId }).select('_id');

    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student doesnot exist!');
    }

    // check if the student is enrolled in the offered course of the same semester
    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: offeredCourse.semesterRegistration,
        offeredCourse: offeredCourse._id,
        student: student._id,
    });

    if (isStudentAlreadyEnrolled) {
        throw new AppError(
            httpStatus.CONFLICT,
            'Student is enrolled in this course!'
        );
    }

    // check if total credit of the student exceeds max credit of this semester reg

    // get the semesterRegistration max credit
    const semesterRegistration = await SemesterRegistration.findById(
        offeredCourse.semesterRegistration
    ).select('maxCredit');

    let totalCreditsOfThisSemesterForTheStudent: {
        totalEnrolledCredits: number;
    }[] = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: offeredCourse.semesterRegistration,
                student: student._id,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourse',
            },
        },
        {
            $unwind: '$enrolledCourse',
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: '$enrolledCourse.credits' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1,
            },
        },
    ]);

    // if the student doesn't have any enrolled course the following is going to return []
    if (!totalCreditsOfThisSemesterForTheStudent.length) {
        totalCreditsOfThisSemesterForTheStudent = [
            {
                totalEnrolledCredits: 0,
            },
        ];
    }

    // get the course to get the credits
    const course = await Course.findById(offeredCourse.course).select(
        'credits'
    );

    const totalEnrolledCreditsGoingToBe =
        totalCreditsOfThisSemesterForTheStudent[0].totalEnrolledCredits +
        course!.credits;

    if (totalEnrolledCreditsGoingToBe > semesterRegistration!.maxCredit!) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You have exceeded max number of credits!'
        );
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const result = await EnrolledCourse.create(
            [
                {
                    semesterRegistration: offeredCourse.semesterRegistration,
                    academicSemester: offeredCourse.academicSemester,
                    academicFaculty: offeredCourse.academicFaculty,
                    academicDepartment: offeredCourse.academicDepartment,
                    offeredCourse: offeredCourse._id,
                    course: offeredCourse.course,
                    student: student._id,
                    faculty: offeredCourse.faculty,
                },
            ],
            { session }
        );

        // if fails
        if (!result) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to enroll course!'
            );
        }

        // update maxCapacity of the offered course
        const updatedOfferedCourse = await OfferedCourse.findByIdAndUpdate(
            offeredCourse._id,
            {
                maxCapacity: offeredCourse.maxCapacity - 1,
            },
            { session }
        );

        if (!updatedOfferedCourse) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'max capcity update failed!'
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return result;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};

const getMyEnrolledCoursesFromDB = async (
    studentId: string,
    query: Record<string, unknown>
) => {
    const student = await Student.findOne({ id: studentId });

    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
    }

    const enrolledCourseQuery = new QueryBuilder(
        EnrolledCourse.find({ student: student._id }).populate(
            'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty'
        ),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await enrolledCourseQuery.modelQuery;
    const meta = await enrolledCourseQuery.countTotal();

    return {
        meta,
        result,
    };
};

const updateEnrolledCourseMarksIntoDB = async (
    facultyId: string,
    enrolledCourse: Partial<TEnrolledCourse>
) => {
    const { semesterRegistration, offeredCourse, student, courseMarks } =
        enrolledCourse;

    // check if semester registration exist
    const isSemesterRegistrationExist =
        await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester registration not found!'
        );
    }

    // check if offered course exist
    const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);

    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
    }
    const isStudentExist = await Student.findById(student);

    if (!isStudentExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
    }

    // get the faculty _id
    const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

    if (!faculty) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }

    // check that the faculty is allowed to update the marks for the student
    const isCourseBelongToFaculty = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty._id,
    });

    if (!isCourseBelongToFaculty) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
    }

    // update the marks, grade, gradePoints & isCompleted
    const modifiedData: Record<string, unknown> = {};

    if (courseMarks?.finalTerm) {
        const { classTest1, classTest2, midTerm } =
            isCourseBelongToFaculty.courseMarks;

        // calculate total marks
        const totalMarks =
            Math.ceil(classTest1) +
            Math.ceil(classTest2) +
            Math.ceil(midTerm) +
            Math.ceil(courseMarks.finalTerm);

        // calculate grade & grade points
        const result = calculateGradeAndPoints(totalMarks);

        modifiedData.grade = result.grade;
        modifiedData.gradePoints = result.gradePoints;
        modifiedData.isCompleted = true;
    }

    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }

    const result = await EnrolledCourse.findByIdAndUpdate(
        isCourseBelongToFaculty._id,
        modifiedData,
        { new: true, runValidators: true }
    );

    return result;
};

export const EnrolledCourseServices = {
    insertEnrolledCourseIntoDB,
    getMyEnrolledCoursesFromDB,
    updateEnrolledCourseMarksIntoDB,
};
