import { Model, Types } from 'mongoose';

export type TGuardian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
};

export type TName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export type TLocalGuardian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
};

export enum TBloodGroup {
    'A+' = 'A+',
    'A-' = 'A-',
    'B+' = 'B+',
    'B-' = 'B-',
    'AB+' = 'AB+',
    'AB-' = 'AB-',
    'O+' = 'O+',
    'O-' = 'O-',
}

export default interface TStudent {
    id: string;
    user: Types.ObjectId;
    name: TName;
    gender: 'male' | 'female';
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: TBloodGroup;
    presentAddress: string;
    permanentAddress: string;
    guardian: TGuardian;
    localGuardian: TLocalGuardian;
    profileImg?: string;
}

// for creating instance method for Student Model

// export interface StudentMethods {
//     isStudentExist(id: string): Promise<TStudent | null>;
// }

// export type StudentModel = Model<TStudent, {}, StudentMethods>;

// for creating static method of Student Model

export interface StudentModel extends Model<TStudent> {
    isStudentExist(id: string): Promise<TStudent | null>;
}
