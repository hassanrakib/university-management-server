import { Types } from 'mongoose';
import TAcademicFaculty from './academic-faculty.interface';
import { AcademicFaculty } from './academic-faculty.model';

const createAcademicFacultyIntoDB = async (
    academicFaculty: TAcademicFaculty
) => {
    return await AcademicFaculty.create(academicFaculty);
};

const fetchAcademicFacultiesFromDB = async () => {
    return await AcademicFaculty.find();
};

const fetchAcademicFacultyByIdFromDB = async (facultyId: string) => {
    return await AcademicFaculty.findById(facultyId);
};

const updateAcademicFacultyByIdInDB = async (
    facultyId: string,
    facultyDocPart: Partial<TAcademicFaculty>
) => {
    return await AcademicFaculty.updateOne(
        { _id: new Types.ObjectId(facultyId) },
        facultyDocPart
    );
};

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    fetchAcademicFacultiesFromDB,
    fetchAcademicFacultyByIdFromDB,
    updateAcademicFacultyByIdInDB,
};
