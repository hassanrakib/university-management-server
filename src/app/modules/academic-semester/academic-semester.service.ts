import { TAcademicSemester } from './academic-semester.interface';
import { AcademicSemester } from './academic-semester.model';

const createAcademicSemesterIntoDB = async (
    academicSemester: TAcademicSemester
) => {
    return await AcademicSemester.create(academicSemester);
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
};
