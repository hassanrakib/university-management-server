import { TAcademicSemester } from '../academic-semester/academic-semester.interface';

// year semesterCode 4 digit number
export const generateStudentId = (academicSemester: TAcademicSemester) => {
    // first time '0001'
    let fourDigitNumber = (1).toString().padStart(4, '0');

    return `${academicSemester.year}${academicSemester.code}${fourDigitNumber}`;
};
