import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { AcademicFacultyServices } from './academic-faculty.service';

const createAcademicFaculty = catchAsync(async (req, res, next) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: httpStatus[200],
        data: result,
    });
});

const getAcademicFaculties = catchAsync(async (req, res, next) => {
    const result = await AcademicFacultyServices.fetchAcademicFacultiesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Faculties fetched successfully!',
        data: result,
    });
});

const getAcademicFacultyById = catchAsync(async (req, res, next) => {
    const result = await AcademicFacultyServices.fetchAcademicFacultyByIdFromDB(
        req.params.facultyId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Faculty fetched successfully!',
        data: result,
    });
});

const updateAcademicFacultyById = catchAsync(async (req, res, next) => {
    const result = await AcademicFacultyServices.updateAcademicFacultyByIdInDB(
        req.params.facultyId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Faculty updated successfully!',
        data: result,
    });
});

export const AcademicFacultyController = {
    createAcademicFaculty,
    getAcademicFaculties,
    getAcademicFacultyById,
    updateAcademicFacultyById,
};
