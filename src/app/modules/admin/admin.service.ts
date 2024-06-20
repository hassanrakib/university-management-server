import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import TAdmin from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const fetchAdminsFromDB = async (query: Record<string, unknown>) => {
    const adminQuery = new QueryBuilder(Admin.find(), query)
        .search(adminSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await adminQuery.modelQuery.populate('managementDepartment');

    return result;
};

const fetchAdminByIdFromDB = async (adminId: string) => {
    return await Admin.findOne({ id: adminId }).populate(
        'managementDepartment'
    );
};

const updateAdminByIdInDB = async (
    adminId: string,
    adminDocPart: Partial<TAdmin>
) => {
    const { name, ...remainingData } = adminDocPart;

    const modifiedAdmin: Record<string, unknown> = { ...remainingData };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedAdmin[`name.${key}`] = value;
        }
    }

    return await Admin.findOneAndUpdate({ id: adminId }, adminDocPart, {
        new: true,
        runValidators: true,
    });
};

const deleteAdminFromDB = async (adminId: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedAdmin = await Admin.findOneAndUpdate(
            { id: adminId },
            { isDeleted: true },
            { new: true, session }
        );

        if (!deletedAdmin) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete student'
            );
        }

        // get user _id from deletedAdmin
        const userId = deletedAdmin.user;

        const deletedUser = await User.findOneAndUpdate(
            { _id: userId },
            { isDeleted: true },
            { new: true, session }
        );

        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedAdmin;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};

export const AdminServices = {
    fetchAdminsFromDB,
    fetchAdminByIdFromDB,
    updateAdminByIdInDB,
    deleteAdminFromDB,
};
