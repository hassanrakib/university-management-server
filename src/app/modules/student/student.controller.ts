import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';

const fetchStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const studentData = await StudentServices.getStudent(id);
        res.status(200).json({ data: studentData });
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
        res.status(200).json({ data: deletedData });
    } catch (err) {
        next(err);
    }
};

export const StudentControllers = {
    fetchStudent,
    deleteStudent,
};
