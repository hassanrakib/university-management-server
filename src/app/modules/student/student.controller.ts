import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/send-response';
import httpStatus from 'http-status';

const fetchStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const studentData = await StudentServices.getStudent(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: httpStatus[200],
            data: studentData,
        });
    } catch (err: unknown) {
        next(err);
    }
};

const deleteStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const deletedData = await StudentServices.markStudentDeleted(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: httpStatus[200],
            data: deletedData,
        });
    } catch (err) {
        next(err);
    }
};

export const StudentControllers = {
    fetchStudent,
    deleteStudent,
};
