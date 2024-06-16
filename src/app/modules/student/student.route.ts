import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validate-request';
import { studentValidations } from './student.validation';

const studentRouter = express.Router();

studentRouter.get('/', StudentControllers.fetchAllStudentents);
studentRouter.get('/:id', StudentControllers.fetchStudent);
studentRouter.patch(
    '/:id',
    validateRequest(studentValidations.UpdateStudentSchema),
    StudentControllers.updateStudent
);
studentRouter.delete('/:id', StudentControllers.deleteStudent);

export const StudentRoutes = studentRouter;
