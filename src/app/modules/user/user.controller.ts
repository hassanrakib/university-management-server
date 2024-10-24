import { UserServices } from './user.service';
import sendResponse from '../../utils/send-response';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import AppError from '../../errors/AppError';

const createStudent = catchAsync(async (req, res, next) => {

    // make profile image compulsory
    if(!req.file) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Profile image is required!');
    }

    const { password, student: studentData } = req.body;

    // send req to the services
    const insertedStudent = await UserServices.insertStudentToDb(
        password,
        studentData,
        req.file as Express.Multer.File
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
    const insertedFaculty = await UserServices.insertFacultyToDB(
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

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;

    // send req to the service
    const insertedAdmin = await UserServices.insertAdminToDB(
        password,
        adminData
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin created successfully',
        data: insertedAdmin,
    });
});

// get me only using token
const getMe = catchAsync(async (req, res) => {
    const user = await UserServices.getMeFromDB(req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: user,
    });
});

const changeUserStatus = catchAsync(async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const updatedUser = await UserServices.changeUserStatusIntoDB(id, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status updated successfully',
        data: updatedUser,
    });
});

export const UserController = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeUserStatus,
};
