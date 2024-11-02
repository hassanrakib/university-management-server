import express from 'express';
import { CourseController } from './course.controller';
import validateRequest from '../../middlewares/validate-request';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();
router.post(
    '/create-course',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(CourseValidations.createCourseSchema),
    CourseController.createCourse
);
router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.student,
        USER_ROLE.faculty
    ),
    CourseController.getAllCourses
);
router.get(
    '/:courseId',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.student,
        USER_ROLE.faculty
    ),
    CourseController.getCourseById
);
router.patch(
    '/:courseId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    CourseController.updateCourseById
);
router.delete(
    '/:courseId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    CourseController.deleteCourseById
);
router.put(
    '/:courseId/assign-faculties',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(CourseValidations.updateCourseFacultySchema),
    CourseController.assignFacultiesWithCourse
);

router.get(
    '/:courseId/get-faculties',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.student, USER_ROLE.faculty),
    CourseController.getCourseFaculties
);
router.delete(
    '/:courseId/remove-faculties',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(CourseValidations.updateCourseFacultySchema),
    CourseController.removeFacultiesFromCourse
);

export const CourseRoutes = router;
