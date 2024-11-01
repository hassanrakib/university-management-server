import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { AcademicDepartmentValidations } from './academic-department.validation';
import { AcademicDepartmentController } from './academic-department.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/create-academic-department',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
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
