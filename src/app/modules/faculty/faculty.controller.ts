import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { FacultyService } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res, next) => {
    const faculties = await FacultyService.fetchFacultiesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties fetched successfully!',
        data: faculties,
    });
});

export const FacultyController = {
    getAllFaculties,
};
