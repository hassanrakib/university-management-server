import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import StudentSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student } = req.body;

        // validate using student schema of joi
        // const { value: validatedStudentByJoi, error } =
        //     studentValidationSchema.validate(student);

        // if (error) {
        //     throw error;
        // }

        // validate using student schema of zod
        const { success, data, error } = StudentSchema.safeParse(student);

        if (!success) {
            throw error;
        }

        // send response
        const insertedStudent = await StudentServices.insertStudentToDb(data);

        res.status(200).json({
            success: true,
            message: 'successfully inserted',
            data: insertedStudent,
        });
    } catch (err: unknown) {
        res.status(500).json({
            success: false,
            message: (err as Error)?.message,
        });
    }
};

const fetchStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const studentData = await StudentServices.getStudent(id);
        res.status(200).json({ data: studentData });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: (err as Error)?.message,
        });
    }
};

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedData = await StudentServices.markStudentDeleted(id);
        res.status(200).json({ data: deletedData });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: (err as Error)?.message,
        });
    }
};

export const StudentControllers = {
    createStudent,
    fetchStudent,
    deleteStudent,
};
