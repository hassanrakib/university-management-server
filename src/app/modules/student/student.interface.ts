export type Guardian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
};

export type Name = {
    firstName: string;
    middleName: string;
    lastName: string;
};

export type LocalGuardian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
};

export enum BloodGroup {
    'A+' = 'A+',
    'A-' = 'A-',
    'B+' = 'B+',
    'B-' = 'B-',
    'AB+' = 'AB+',
    'AB-' = 'AB-',
    'O+' = 'O+',
    'O-' = 'O-',
}

export default interface Student {
    id: string;
    name: Name;
    gender: 'male' | 'female';
    dateOfBirth: string;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: BloodGroup;
    presentAddress: string;
    permanentAddress: string;
    guardian: Guardian;
    localGuardian: LocalGuardian;
    profileImg?: string;
    isActive: 'active' | 'blocked';
}
