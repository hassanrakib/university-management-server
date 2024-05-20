import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
    try {
        const student = req.body;

        // send response
        const insertedStudent =
            await StudentServices.insertStudentToDb(student);

        res.status(200).json({
            success: true,
            message: 'successfully inserted',
            data: insertedStudent,
        });
    } catch (err: unknown) {
        console.error(err);
    }
};

export const StudentControllers = { createStudent };
