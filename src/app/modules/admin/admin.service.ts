import TAdmin from './admin.interface';
import { Admin } from './admin.model';

const fetchAdminsFromDB = async () => {
    return await Admin.find();
};

const fetchAdminByIdFromDB = async (adminId: string) => {
    return await Admin.findOne({ id: adminId });
};

const updateAdminByIdInDB = async (
    adminId: string,
    adminDocPart: Partial<TAdmin>
) => {
    return await Admin.updateOne({ id: adminId }, adminDocPart);
};

export const AdminServices = {
    fetchAdminsFromDB,
    fetchAdminByIdFromDB,
    updateAdminByIdInDB,
};
