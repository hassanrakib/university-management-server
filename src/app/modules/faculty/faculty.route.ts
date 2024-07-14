import express from 'express';
import { FacultyController } from './faculty.controller';
import { FacultyValidations } from './faculty.validation';
import validateRequest from '../../middlewares/validate-request';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth(), FacultyController.getAllFaculties);
router.get('/:facultyId', FacultyController.getFacultyById);
router.patch(
    '/:facultyId',
    validateRequest(FacultyValidations.updateFacultySchema),
    FacultyController.updateFacultyById
);

export const FacultyRoutes = router;
