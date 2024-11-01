import express from 'express';
import { AcademicSemesterController } from './academic-semester.controller';
import validateRequest from '../../middlewares/validate-request';
import { AcademicSemesterValidations } from './academic-semester.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/create-academic-semester',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AcademicSemesterValidations.CreateAcademicSemesterSchema),
    AcademicSemesterController.createAcademicSemester
);

router.get('/', AcademicSemesterController.getAcademicSemesters);
router.get('/:semesterId', AcademicSemesterController.getAcademicSemesterById);
router.patch(
    '/:semesterId',
    validateRequest(AcademicSemesterValidations.UpdateAcademicSemesterSchema),
    AcademicSemesterController.updateAcademicSemesterById
);

export const AcademicSemesterRoutes = router;
