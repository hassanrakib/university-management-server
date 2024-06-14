import { Types } from 'mongoose';
import { semesterNameCodeMapper } from './academic-semester.constant';
import { TAcademicSemester } from './academic-semester.interface';
import { AcademicSemester } from './academic-semester.model';

const createAcademicSemesterIntoDB = async (
    academicSemester: TAcademicSemester
) => {
    // semesterName === semesterCode check
    if (
        semesterNameCodeMapper[academicSemester.name] !== academicSemester.code
    ) {
        throw new Error('Invalid Semester Code!');
    }

    return await AcademicSemester.create(academicSemester);
};

const fetchAcademicSemestersFromDB = async () => {
    return await AcademicSemester.find();
};

const fetchAcademicSemesterByIdFromDB = async (semesterId: string) => {
    return await AcademicSemester.findById(semesterId);
};

const updateAcademicSemesterByIdInDB = async (
    semesterId: string,
    semesterDocPart: Partial<TAcademicSemester>
) => {
    if (
        semesterDocPart.code &&
        semesterDocPart.name &&
        semesterNameCodeMapper[semesterDocPart.name] !== semesterDocPart.code
    ) {
        throw new Error('Invalid semester code or name');
    }
    return await AcademicSemester.updateOne(
        { _id: new Types.ObjectId(semesterId) },
        semesterDocPart
    );
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    fetchAcademicSemestersFromDB,
    fetchAcademicSemesterByIdFromDB,
    updateAcademicSemesterByIdInDB,
};
