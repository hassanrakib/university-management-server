import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { FacultyService } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res, next) => {
    console.log(req.cookies);

    const faculties = await FacultyService.fetchFacultiesFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties fetched successfully!',
        data: faculties,
    });
});

const getFacultyById = catchAsync(async (req, res, next) => {
    const result = await FacultyService.fetchFacultyByIdFromDB(
        req.params.facultyId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty fetched successfully!',
        data: result,
    });
});

const updateFacultyById = catchAsync(async (req, res, next) => {
    const result = await FacultyService.updateFacultyByIdInDB(
        req.params.facultyId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty updated successfully!',
        data: result,
    });
});

const deleteFacultyById = catchAsync(async (req, res) => {
    const result = await FacultyService.deleteFacultyByIdFromDB(req.params.facultyId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty is deleted succesfully',
        data: result,
    });
});

export const FacultyController = {
    getAllFaculties,
    getFacultyById,
    updateFacultyById,
    deleteFacultyById,
};
