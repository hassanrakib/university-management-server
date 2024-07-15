import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.loginCredentialsSchema),
    AuthController.loginUser
);

router.post(
    '/change-password',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(AuthValidation.changePasswordSchema),
    AuthController.changePassword
);

export const AuthRoutes = router;
