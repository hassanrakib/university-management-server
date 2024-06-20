import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { AdminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res, next) => {
    const admins = await AdminServices.fetchAdminsFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admins fetched successfully!',
        data: admins,
    });
});

const getAdminById = catchAsync(async (req, res, next) => {
    const result = await AdminServices.fetchAdminByIdFromDB(req.params.adminId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin fetched successfully!',
        data: result,
    });
});

const updateAdminById = catchAsync(async (req, res, next) => {
    const result = await AdminServices.updateAdminByIdInDB(
        req.params.adminid,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin updated successfully!',
        data: result,
    });
});

const deleteAdminById = catchAsync(async (req, res, next) => {
    const { adminId } = req.params;
    const result = await AdminServices.deleteAdminFromDB(adminId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin deleted successfully!',
        data: result,
    });
});

export const AdminController = {
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById,
};
