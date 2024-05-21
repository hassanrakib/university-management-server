import express from 'express';
import { StudentControllers } from './student.controller';

const studentRouter = express.Router();

studentRouter.post('/create-student', StudentControllers.createStudent);
studentRouter.get('/:id', StudentControllers.fetchStudent);
studentRouter.delete('/:id', StudentControllers.deleteStudent);

export const StudentRoutes = studentRouter;
