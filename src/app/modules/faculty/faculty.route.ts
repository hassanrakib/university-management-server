import express from 'express';
import { FacultyController } from './faculty.controller';
import { FacultyValidations } from './faculty.validation';
import validateRequest from '../../middlewares/validate-request';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyController.getAllFaculties
);
router.get(
    '/:facultyId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyController.getFacultyById
);
router.patch(
    '/:facultyId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(FacultyValidations.updateFacultySchema),
    FacultyController.updateFacultyById
);
router.delete(
    '/:facultyId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    FacultyController.deleteFacultyById
);

export const FacultyRoutes = router;
