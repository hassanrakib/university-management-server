import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import {
    Status,
    TSemesterRegistration,
} from './semester-registration.interface';
import { SemesterRegistration } from './semester-registration.model';
import QueryBuilder from '../../builder/QueryBuilder';

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

const updateSemesterRegistrationIntoDB = async (id: string) => {};

export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSemesterRegistrationByIdFromDB,
    updateSemesterRegistrationIntoDB,
};
