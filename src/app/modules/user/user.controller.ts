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
        message: 'Student created successfully',
        data: insertedStudent,
    });
});

const createFaculty = catchAsync(async (req, res, next) => {
    const { password, faculty: facultyData } = req.body;

    // send req to the service
    const insertedFaculty = UserServices.insertFacultyToDB(
        password,
        facultyData
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculty created successfully',
        data: insertedFaculty,
    });
});

const createAdmin = catchAsync(async (req, res, next) => {
    const { password, admin: adminData } = req.body;

    // send req to the service
    const insertedAdmin = UserServices.insertAdminToDB(password, adminData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin created successfully',
        data: insertedAdmin,
    });
});

export const UserController = {
    createStudent,
    createFaculty,
    createAdmin,
};
