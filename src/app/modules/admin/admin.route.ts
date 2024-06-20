import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validate-request';
import { AdminValidations } from './admin.validation';

const router = express.Router();
router.get('/', AdminController.getAllAdmins);
router.get('/:adminId', AdminController.getAdminById);
router.patch(
    '/:adminId',
    validateRequest(AdminValidations.updateAdminSchema),
    AdminController.updateAdminById
);

export const AdminRoutes = router;
