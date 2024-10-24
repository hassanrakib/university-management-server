import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validate-request';
import { FacultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidations } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        // attach data from req.body.data (as it is coming from form data) to req.body
        req.body = JSON.parse(req.body.data);
        next();
    },
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

// get me only using token
router.get(
    '/me',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    UserController.getMe
);

router.put(
    '/change-status/:id',
    auth(USER_ROLE.admin),
    validateRequest(UserValidations.updateUserStatusSchema),
    UserController.changeUserStatus
);

export const UserRoutes = router;
