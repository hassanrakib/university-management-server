import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import { TSemesterRegistration } from './semester-registration.interface';
import { SemesterRegistration } from './semester-registration.model';

const createSemesterRegistrationIntoDB = async (
    semesterRegistration: TSemesterRegistration
) => {

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
    })

    if(isSemesterRegistrationExist) {
        throw new AppError(httpStatus.CONFLICT, "This semester is already registered!");
    }

    return await SemesterRegistration.create(semesterRegistration);
};

const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
    
}

export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
};
