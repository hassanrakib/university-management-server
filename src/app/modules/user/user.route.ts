import express from 'express';
import { UserController } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validate-request';
import { FacultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    validateRequest(studentValidations.CreateStudentSchema),
    UserController.createStudent
);

router.post(
    '/create-faculty',
    auth(USER_ROLE.admin),
    validateRequest(FacultyValidations.createFacultySchema),
    UserController.createFaculty
);

router.post(
    '/create-admin',
    // auth(USER_ROLE.admin),
    validateRequest(AdminValidations.createAdminSchema),
    UserController.createAdmin
);

export const UserRoutes = router;
