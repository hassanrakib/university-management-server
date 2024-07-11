import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { OfferedCourseServices } from './offered-course.service';

const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Offered course created successfully!',
        data: result,
    });
});

export const OfferedCourseController = {
    createOfferedCourse,
};
