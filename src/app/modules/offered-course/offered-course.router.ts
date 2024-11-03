import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { OfferedCourseValidations } from './offered-course.validation';
import { OfferedCourseController } from './offered-course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    OfferedCourseController.getAllOfferedCourses
);

router.get(
    '/my-offered-courses',
    auth(USER_ROLE.student),
    OfferedCourseController.getMyOfferedCourses
);

router.get(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student
    ),
    OfferedCourseController.getOfferedCourseById
);

router.post(
    '/create-offered-course',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.createOfferedCourseSchema),
    OfferedCourseController.createOfferedCourse
);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(OfferedCourseValidations.updateOfferedCourseSchema),
    OfferedCourseController.updateOfferedCourse
);

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    OfferedCourseController.deleteOfferedCourseById
);

export const OfferedCourseRoutes = router;
