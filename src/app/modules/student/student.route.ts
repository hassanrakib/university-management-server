import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validate-request';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const studentRouter = express.Router();

studentRouter.get('/', StudentControllers.fetchAllStudentents);
studentRouter.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.faculty),
    StudentControllers.fetchStudent
);
studentRouter.patch(
    '/:id',
    validateRequest(studentValidations.UpdateStudentSchema),
    StudentControllers.updateStudent
);
studentRouter.delete('/:id', StudentControllers.deleteStudent);

export const StudentRoutes = studentRouter;
