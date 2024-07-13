import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { OfferedCourseValidations } from './offered-course.validation';
import { OfferedCourseController } from './offered-course.controller';

const router = express.Router();

router.get("/", OfferedCourseController.getAllOfferedCourses);

router.get("/:id", OfferedCourseController.getOfferedCourseById);

router.post(
    '/create-offered-course',
    validateRequest(OfferedCourseValidations.createOfferedCourseSchema),
    OfferedCourseController.createOfferedCourse
);

router.patch(
    '/:id',
    validateRequest(OfferedCourseValidations.updateOfferedCourseSchema),
    OfferedCourseController.updateOfferedCourse
);

router.delete("/:id", OfferedCourseController.deleteOfferedCourseById);

export const OfferedCourseRoutes = router;
