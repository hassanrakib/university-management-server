import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { AcademicFacultyValidations } from './academic-faculty.validation';
import { AcademicFacultyController } from './academic-faculty.controller';

const router = express.Router();

router.post(
    '/create-academic-faculty',
    validateRequest(AcademicFacultyValidations.AcademicFacultyValidationSchema),
    AcademicFacultyController.createAcademicFaculty
);

router.get('/', AcademicFacultyController.getAcademicFaculties);
router.get('/:facultyId', AcademicFacultyController.getAcademicFacultyById);
router.patch(
    '/:facultyId',
    validateRequest(AcademicFacultyValidations.AcademicFacultyValidationSchema),
    AcademicFacultyController.updateAcademicFacultyById
);

export const AcademicFacultyRoutes = router;
