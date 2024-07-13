import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.loginCredentialsSchema),
    AuthController.loginUser
);

export const AuthRoutes = router;
