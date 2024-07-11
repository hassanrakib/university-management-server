import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { SemesterRegistrationValidations } from './semester-registration.validation';
import { SemesterRegistrationController } from './semester-registration.controller';

const router = express.Router();

router.post(
    '/create-semester-registration',
    validateRequest(
        SemesterRegistrationValidations.createSemesterRegistrationSchema
    ),
    SemesterRegistrationController.createSemesterRegistration
);

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

router.get('/:id', SemesterRegistrationController.getSemesterRegistrationById);

router.patch(
    '/:id',
    validateRequest(
        SemesterRegistrationValidations.updateSemesterRegistrationSchema
    ),
    SemesterRegistrationController.updateSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
