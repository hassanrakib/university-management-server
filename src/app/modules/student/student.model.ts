import { Schema, model } from 'mongoose';
import Student, {
    BloodGroup,
    Guardian,
    LocalGuardian,
    Name,
} from './student.interface';

const nameSchema = new Schema<Name>({
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String, required: true },
});

const guardianSchema = new Schema<Guardian>({
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContactNo: { type: String, required: true },
});

const localGuardianSchema = new Schema<LocalGuardian>({
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
});

const studentSchema = new Schema<Student>({
    id: { type: String, required: true },
    name: nameSchema,
    gender: { type: String, enum: ['male', 'female'] },
    dateOfBirth: { type: String },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: { type: String, enum: Object.values(BloodGroup) },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: guardianSchema,
    localGuardian: localGuardianSchema,
    profileImg: { type: String },
    isActive: ['active', 'blocked'],
});

export const StudentModel = model<Student>('Student', studentSchema);
