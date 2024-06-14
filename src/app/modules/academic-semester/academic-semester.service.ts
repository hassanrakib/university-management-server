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

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
};
