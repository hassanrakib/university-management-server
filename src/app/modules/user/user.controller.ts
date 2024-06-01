import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/send-response';
import httpStatus from 'http-status';

const createStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
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
    } catch (err: unknown) {
        next(err);
    }
};

export const UserController = {
    createStudent,
};
