import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { EnrolledCourseServices } from './enrolled-course.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
    const result = await EnrolledCourseServices.insertEnrolledCourseIntoDB(
        req.user.userId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Enrolled course created successfully!',
        data: result,
    });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const facultyId = req.user.userId;
    
    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
        facultyId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Marks is updated succesfully',
        data: result,
    });
});

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
};
