import express from 'express';
import { UserController } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validate-request';

const router = express.Router();

router.post(
    '/create-student',
    validateRequest(studentValidations.CreateStudentSchema),
    UserController.createStudent
);

export const UserRoutes = router;
