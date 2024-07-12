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

    const {faculty, semesterRegistration, days, startTime, endTime} = offeredCourseDocPart;

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

    if (hasTimeConflict(assignedSchedulesToTheFaculty, newSchedule as TSchedule)) {
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

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB,
};
