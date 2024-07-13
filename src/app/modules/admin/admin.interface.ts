import { Types } from 'mongoose';

export type TAdminName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export default interface TAdmin {
    id: string;
    user: Types.ObjectId;
    designation: string;
    name: TAdminName;
    email: string;
    gender: 'male' | 'female';
    dateOfBirth?: string;
    contactNo: string;
    emergencyContactNo: string;
    presentAddress: string;
    permanentAddress: string;
    profileImg?: string;
    isDeleted?: boolean;
}
