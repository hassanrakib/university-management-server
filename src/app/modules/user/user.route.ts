import express from 'express';
import { UserController } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validate-request';
import { FacultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';

const router = express.Router();

router.post(
    '/create-student',
    validateRequest(studentValidations.CreateStudentSchema),
    UserController.createStudent
);

router.post(
    '/create-faculty',
    validateRequest(FacultyValidations.createFacultySchema),
    UserController.createFaculty
);

router.post(
    '/create-admin',
    validateRequest(AdminValidations.createAdminSchema),
    UserController.createAdmin
);

export const UserRoutes = router;
