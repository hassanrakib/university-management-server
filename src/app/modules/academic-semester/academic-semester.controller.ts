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

export const AcademicSemesterController = {
    createAcademicSemester,
};
