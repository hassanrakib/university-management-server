import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { EnrolledCourseValidations } from './enrolled-course.validation';
import { EnrolledCourseControllers } from './enrolled-course.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/create-enrolled-course',
    validateRequest(EnrolledCourseValidations.createEnrolledCourseSchema),
    auth(USER_ROLE.student),
    EnrolledCourseControllers.createEnrolledCourse
);

router.patch(
    '/update-enrolled-course-marks',
    auth(USER_ROLE.faculty),
    validateRequest(EnrolledCourseValidations.updateEnrolledCourseMarksSchema),
    EnrolledCourseControllers.updateEnrolledCourseMarks
);

export const EnrolledCourseRoutes = router;
