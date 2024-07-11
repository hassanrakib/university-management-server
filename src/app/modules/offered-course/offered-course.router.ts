import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { OfferedCourseValidations } from './offered-course.validation';
import { OfferedCourseController } from './offered-course.controller';

const router = express.Router();

router.post(
    '/create-offered-course',
    validateRequest(OfferedCourseValidations.createOfferedCourseSchema),
    OfferedCourseController.createOfferedCourse
);

export const OfferedCourseRoutes = router;
