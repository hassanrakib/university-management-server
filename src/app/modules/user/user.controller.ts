import { UserServices } from './user.service';
import sendResponse from '../../utils/send-response';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';

const createStudent = catchAsync(async (req, res, next) => {
    const { password, student: studentData } = req.body;

    // send req to the services
    const insertedStudent = await UserServices.insertStudentToDb(
        password,
        studentData
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: httpStatus[200],
        data: insertedStudent,
    });
});

export const UserController = {
    createStudent,
};
