import { Types } from 'mongoose';
import TAcademicDepartment from './academic-department.interface';
import { AcademicDepartment } from './academic-department.model';

const createAcademicDepartmentIntoDB = async (
    academicDepartment: TAcademicDepartment
) => {
    return await AcademicDepartment.create(academicDepartment);
};

const fetchAcademicDepartmentsFromDB = async () => {
    return await AcademicDepartment.find();
};

const fetchAcademicDepartmentByIdFromDB = async (departmentId: string) => {
    return await AcademicDepartment.findById(departmentId);
};

const updateAcademicDepartmentByIdInDB = async (
    departmentId: string,
    departmentDocPart: Partial<TAcademicDepartment>
) => {
    return await AcademicDepartment.updateOne(
        { _id: new Types.ObjectId(departmentId) },
        departmentDocPart
    );
};

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    fetchAcademicDepartmentsFromDB,
    fetchAcademicDepartmentByIdFromDB,
    updateAcademicDepartmentByIdInDB,
};
