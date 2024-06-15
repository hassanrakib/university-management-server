import { Types } from 'mongoose';

export default interface TAcademicDepartment {
    name: string;
    academicFaculty: Types.ObjectId;
}
