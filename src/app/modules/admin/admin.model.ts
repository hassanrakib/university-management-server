import { Schema, model } from 'mongoose';
import TAdmin, { TAdminName } from './admin.interface';

const adminNameSchema = new Schema<TAdminName>({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
});

const adminSchema = new Schema<TAdmin>(
    {
        id: { type: String, required: true, unique: true },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        designation: { type: String, required: true },
        name: adminNameSchema,
        gender: { type: String, enum: ['male', 'female'], required: true },
        dateOfBirth: { type: String },
        contactNo: { type: String, required: true },
        emergencyContactNo: { type: String, required: true },
        presentAddress: { type: String, required: true },
        permanentAddress: { type: String, required: true },
        profileImg: { type: String },
        managementDepartment: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicDepartment',
            required: true,
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export const Admin = model<TAdmin>('Admin', adminSchema);
