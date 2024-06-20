import express from 'express';
import { FacultyController } from './faculty.controller';
import { FacultyValidations } from './faculty.validation';
import validateRequest from '../../middlewares/validate-request';

const router = express.Router();

router.get('/', FacultyController.getAllFaculties);
router.get('/:facultyId', FacultyController.getFacultyById);
router.patch(
    '/:facultyId',
    validateRequest(FacultyValidations.updateFacultySchema),
    FacultyController.updateFacultyById
);

export const FacultyRoutes = router;
