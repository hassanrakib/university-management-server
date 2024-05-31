import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';

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

        res.status(200).json({
            success: true,
            message: 'successfully inserted',
            data: insertedStudent,
        });
    } catch (err: unknown) {
        next(err);
    }
};

export const UserController = {
    createStudent,
};
