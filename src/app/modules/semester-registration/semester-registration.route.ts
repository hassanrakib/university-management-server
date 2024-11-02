import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { SemesterRegistrationValidations } from './semester-registration.validation';
import { SemesterRegistrationController } from './semester-registration.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/create-semester-registration',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(
        SemesterRegistrationValidations.createSemesterRegistrationSchema
    ),
    SemesterRegistrationController.createSemesterRegistration
);

router.get(
    '/',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
        USER_ROLE.faculty,
        USER_ROLE.student
    ),
    SemesterRegistrationController.getAllSemesterRegistrations
);

router.get(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
        USER_ROLE.faculty,
        USER_ROLE.student
    ),
    SemesterRegistrationController.getSemesterRegistrationById
);

router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(
        SemesterRegistrationValidations.updateSemesterRegistrationSchema
    ),
    SemesterRegistrationController.updateSemesterRegistration
);

router.delete(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    SemesterRegistrationController.deleteSemesterRegistrationById
);

export const SemesterRegistrationRoutes = router;
