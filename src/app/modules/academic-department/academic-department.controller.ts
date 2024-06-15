import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { AcademicDepartmentServices } from './academic-department.service';

const createAcademicDepartment = catchAsync(async (req, res, next) => {
    const result =
        await AcademicDepartmentServices.createAcademicDepartmentIntoDB(
            req.body
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: httpStatus[200],
        data: result,
    });
});

const getAcademicDepartments = catchAsync(async (req, res, next) => {
    const result =
        await AcademicDepartmentServices.fetchAcademicDepartmentsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic departments fetched successfully!',
        data: result,
    });
});

const getAcademicDepartmentById = catchAsync(async (req, res, next) => {
    const result =
        await AcademicDepartmentServices.fetchAcademicDepartmentByIdFromDB(
            req.params.departmentId
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic department fetched successfully!',
        data: result,
    });
});

const updateAcademicDepartmentById = catchAsync(async (req, res, next) => {
    const result =
        await AcademicDepartmentServices.updateAcademicDepartmentByIdInDB(
            req.params.departmentId,
            req.body
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic department updated successfully!',
        data: result,
    });
});

export const AcademicDepartmentController = {
    createAcademicDepartment,
    getAcademicDepartments,
    getAcademicDepartmentById,
    updateAcademicDepartmentById,
};
