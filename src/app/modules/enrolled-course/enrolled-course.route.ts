import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { EnrolledCourseValidations } from './enrolled-course.validation';
import { EnrolledCourseControllers } from './enrolled-course.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/create-enrolled-course',
    auth(USER_ROLE.student),
    validateRequest(EnrolledCourseValidations.createEnrolledCourseSchema),
    auth(USER_ROLE.student),
    EnrolledCourseControllers.createEnrolledCourse
);

router.get(
    '/my-enrolled-courses',
    auth(USER_ROLE.student),
    EnrolledCourseControllers.getMyEnrolledCourses
);

router.patch(
    '/update-enrolled-course-marks',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    validateRequest(EnrolledCourseValidations.updateEnrolledCourseMarksSchema),
    EnrolledCourseControllers.updateEnrolledCourseMarks
);

export const EnrolledCourseRoutes = router;
