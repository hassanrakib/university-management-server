import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offered-course/offered-course.model';
import { TEnrolledCourse } from './enrolled-course.interface';
import EnrolledCourse from './enrolled-course.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semester-registration/semester-registration.model';
import { Course } from '../course/course.model';

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

    const totalCreditsOfThisSemesterForTheStudent: {
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
                totalEnrolledCredits: {
                    $ifNull: ['$totalEnrolledCredits', 0],
                },
            },
        },
    ]);

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

const updateEnrolledCourseMarksIntoDB = async (enrolledCourse: Partial<TEnrolledCourse>) => {

}

export const EnrolledCourseServices = {
    insertEnrolledCourseIntoDB,
    updateEnrolledCourseMarksIntoDB,
};
