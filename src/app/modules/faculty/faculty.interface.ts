import { Types } from 'mongoose';

export type TFacultyName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export default interface TFaculty {
    id: string;
    user: Types.ObjectId;
    designation: string;
    name: TFacultyName;
    gender: 'male' | 'female';
    dateOfBirth?: string;
    contactNo: string;
    emergencyContactNo: string;
    presentAddress: string;
    permanentAddress: string;
    profileImg?: string;
    academicFaculty: Types.ObjectId;
    academicDepartment: Types.ObjectId;
    isDeleted?: boolean;
}
