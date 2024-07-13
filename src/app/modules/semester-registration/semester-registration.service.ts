import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import {
    Status,
    TSemesterRegistration,
} from './semester-registration.interface';
import { SemesterRegistration } from './semester-registration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import mongoose from 'mongoose';
import { OfferedCourse } from '../offered-course/offered-course.model';

const createSemesterRegistrationIntoDB = async (
    semesterRegistration: TSemesterRegistration
) => {
    // check if there is any semester registration of which status property set to "UPCOMING" or "ONGOING"
    const isAnySemesterRegistrationUpcomingOrOngoing =
        await SemesterRegistration.findOne({
            $or: [{ status: Status.UPCOMING }, { status: Status.ONGOING }],
        });

    if (isAnySemesterRegistrationUpcomingOrOngoing) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Already a semester is ${isAnySemesterRegistrationUpcomingOrOngoing.status}`
        );
    }

    // check if academic semester doesn't exist
    const isAcademicSemesterExist = await AcademicSemester.findById(
        semesterRegistration.academicSemester
    );

    if (!isAcademicSemesterExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This academic semester not found !'
        );
    }

    // check if semesterRegistration already exists
    const isSemesterRegistrationExist = await SemesterRegistration.findOne({
        academicSemester: semesterRegistration.academicSemester,
    });

    if (isSemesterRegistrationExist) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This semester is already registered!'
        );
    }

    return await SemesterRegistration.create(semesterRegistration);
};

const getAllSemesterRegistrationsFromDB = async (
    query: Record<string, unknown>
) => {
    const semesterRegistrationQuery = new QueryBuilder(
        SemesterRegistration.find(),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result =
        await semesterRegistrationQuery.modelQuery.populate('academicSemester');

    return result;
};

const getSemesterRegistrationByIdFromDB = async (id: string) => {
    return await SemesterRegistration.findById(id);
};

const updateSemesterRegistrationIntoDB = async (
    id: string,
    semesterRegistrationDocPart: Partial<TSemesterRegistration>
) => {
    // check if semesterRegistration doesn't exist
    const requestedSemesterRegistration =
        await SemesterRegistration.findById(id);

    if (!requestedSemesterRegistration) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This semester registration is not found!'
        );
    }

    // if the requested semester registration's status is "ENDED", then we will not update

    if (requestedSemesterRegistration?.status === Status.ENDED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Requested semester registration is ${requestedSemesterRegistration.status}`
        );
    }

    // 'UPCOMING' => 'ONGOING' => 'ENDED'
    if (
        requestedSemesterRegistration?.status === Status.UPCOMING &&
        semesterRegistrationDocPart.status === Status.ENDED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You can not change semester registration status from upcoming to ended directly'
        );
    }

    if (
        requestedSemesterRegistration?.status === Status.ONGOING &&
        semesterRegistrationDocPart.status === Status.UPCOMING
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You can not change semester registration status from ongoing to upcoming'
        );
    }

    return await SemesterRegistration.findByIdAndUpdate(
        id,
        semesterRegistrationDocPart,
        {
            new: true,
            runValidators: true,
        }
    );
};

const deleteSemesterRegistrationByIdFromDB = async (id: string) => {
    const semesterRegistration =
        await SemesterRegistration.findById(id).select('status');

    if (!semesterRegistration) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Semester Registration not found!'
        );
    }

    if (semesterRegistration.status !== Status.UPCOMING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not delete a semester registration when it's status set to ${semesterRegistration.status}`
        );
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // delete all of the offered courses related to the semester registration
        const deletedOfferedCourse = await OfferedCourse.deleteMany(
            { semesterRegistration: id },
            { session }
        );

        if (!deletedOfferedCourse) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete semester registration!'
            );
        }

        // now delete the semester registration
        const deletedSemesterRegistration =
            await SemesterRegistration.findByIdAndDelete(id, { session, new: true });

        if (!deletedSemesterRegistration) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete semester registration !'
            );
        }

        await session.commitTransaction();
        await session.endSession();
        return null;
    } catch (err: unknown) {

        await session.abortTransaction();
        await session.endSession();

        throw err;
    }
};

export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSemesterRegistrationByIdFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationByIdFromDB,
};
