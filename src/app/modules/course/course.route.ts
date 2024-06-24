import express from 'express';
import { CourseController } from './course.controller';
import validateRequest from '../../middlewares/validate-request';
import { CourseValidations } from './course.validation';

const router = express.Router();
router.post(
    '/create-course',
    validateRequest(CourseValidations.createCourseSchema),
    CourseController.createCourse
);
router.get('/', CourseController.getAllCourses);
router.get('/:courseId', CourseController.getCourseById);
router.patch('/:courseId', CourseController.updateCourseById);
router.delete('/:courseId', CourseController.deleteCourseById);
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
