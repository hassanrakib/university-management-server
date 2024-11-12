import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { AcademicSemesterServices } from './academic-semester.service';

const createAcademicSemester = catchAsync(async (req, res, next) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: httpStatus[200],
        data: result,
    });
});

const getAcademicSemesters = catchAsync(async (req, res, next) => {
    const result =
        await AcademicSemesterServices.fetchAcademicSemestersFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semesters fetched successfully!',
        data: result.result,
        meta: result.meta,
    });
});

const getAcademicSemesterById = catchAsync(async (req, res, next) => {
    const result =
        await AcademicSemesterServices.fetchAcademicSemesterByIdFromDB(
            req.params.semesterId
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semester fetched successfully!',
        data: result,
    });
});

const updateAcademicSemesterById = catchAsync(async (req, res, next) => {
    const result =
        await AcademicSemesterServices.updateAcademicSemesterByIdInDB(
            req.params.semesterId,
            req.body
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Semester updated successfully!',
        data: result,
    });
});

export const AcademicSemesterController = {
    createAcademicSemester,
    getAcademicSemesters,
    getAcademicSemesterById,
    updateAcademicSemesterById,
};
