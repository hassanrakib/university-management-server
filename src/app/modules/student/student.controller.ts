import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student } = req.body;

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

const fetchStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const studentData = await StudentServices.getStudent(id);
        res.status(200).json({ data: studentData });
    } catch (err) {
        console.log(err);
    }
};

export const StudentControllers = { createStudent, fetchStudent };
