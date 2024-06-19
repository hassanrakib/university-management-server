import { Schema, model } from 'mongoose';
import TFaculty, { TFacultyName } from './faculty.interface';

const facultyNameSchema = new Schema<TFacultyName>({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
});

const facultySchema = new Schema<TFaculty>(
    {
        id: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, required: true },
        designation: { type: String, required: true },
        name: facultyNameSchema,
        gender: { type: String, enum: ['male', 'female'], required: true },
        dateOfBirth: { type: String },
        contactNo: { type: String, required: true },
        emergencyContactNo: { type: String, required: true },
        presentAddress: { type: String, required: true },
        permanentAddress: { type: String, required: true },
        profileImg: { type: String },
        academicFaculty: { type: Schema.Types.ObjectId, required: true },
        academicDepartment: { type: Schema.Types.ObjectId, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export const Faculty = model<TFaculty>('Faculty', facultySchema);
