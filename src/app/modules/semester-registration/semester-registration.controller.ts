import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { SemesterRegistrationService } from './semester-registration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationService.createSemesterRegistrationIntoDB(
            req.body
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration is created successfully!',
        data: result,
    });
});

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationService.getAllSemesterRegistrationsFromDB(
            req.query
        );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Semester Registrations fetched!',
        data: result,
    });
});

const getSemesterRegistrationById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await SemesterRegistrationService.getSemesterRegistrationByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration fetched!',
        data: result,
    });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await SemesterRegistrationService.updateSemesterRegistrationIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester Registration updated!',
        data: result,
    });
});

export const SemesterRegistrationController = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSemesterRegistrationById,
    updateSemesterRegistration,
};
