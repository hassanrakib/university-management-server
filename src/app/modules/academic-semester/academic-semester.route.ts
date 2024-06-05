import express from 'express';
import { AcademicSemesterController } from './academic-semester.controller';
import validateRequest from '../../middlewares/validate-request';
import { AcademicSemesterValidations } from './academic-semester.validation';

const router = express.Router();

router.post(
    '/create-academic-semester',
    validateRequest(AcademicSemesterValidations.CreateAcademicSemesterSchema),
    AcademicSemesterController.createAcademicSemester
);

export const AcademicSemesterRoutes = router;
