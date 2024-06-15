import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { AcademicDepartmentValidations } from './academic-department.validation';
import { AcademicDepartmentController } from './academic-department.controller';

const router = express.Router();

router.post(
    '/create-academic-department',
    validateRequest(
        AcademicDepartmentValidations.createAcademicDepartmentSchema
    ),
    AcademicDepartmentController.createAcademicDepartment
);

router.get('/', AcademicDepartmentController.getAcademicDepartments);
router.get(
    '/:departmentId',
    AcademicDepartmentController.getAcademicDepartmentById
);
router.patch(
    '/:departmentId',
    validateRequest(
        AcademicDepartmentValidations.updateAcademicDepartmentSchema
    ),
    AcademicDepartmentController.updateAcademicDepartmentById
);

export const AcademicDepartmentRoutes = router;
