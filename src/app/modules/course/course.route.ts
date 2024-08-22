import express from 'express';
import { CourseController } from './course.controller';
import validateRequest from '../../middlewares/validate-request';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();
router.post(
    '/create-course',
    validateRequest(CourseValidations.createCourseSchema),
    auth(USER_ROLE.admin),
    CourseController.createCourse
);
router.get('/', CourseController.getAllCourses);
router.get(
    '/:courseId',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    CourseController.getCourseById
);
router.patch('/:courseId', auth(USER_ROLE.admin), CourseController.updateCourseById);
router.delete('/:courseId', auth(USER_ROLE.admin), CourseController.deleteCourseById);
router.put(
    '/:courseId/assign-faculties',
    validateRequest(CourseValidations.updateCourseFacultySchema),
    CourseController.assignFacultiesWithCourse
);
router.delete(
    '/:courseId/remove-faculties',
    validateRequest(CourseValidations.updateCourseFacultySchema),
    CourseController.removeFacultiesFromCourse
);

export const CourseRoutes = router;
