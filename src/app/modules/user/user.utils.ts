import { TAcademicSemester } from '../academic-semester/academic-semester.interface';
import { Student } from '../student/student.model';

const findLastStudentId = async () => {
    const lastStudent = await Student.findOne({}, { _id: 0, id: 1 })
        .sort({ createdAt: -1 })
        .lean();
    return lastStudent?.id;
};

// year semesterCode 4 digit number
export const generateStudentId = async (
    academicSemester: TAcademicSemester
) => {
    let currentId = '0';
    const lastStudentId = await findLastStudentId();
    const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
    const lastStudentSemesterCode = lastStudentId?.substring(4, 6);

    if (
        lastStudentId &&
        lastStudentSemesterCode === academicSemester.code &&
        lastStudentSemesterYear === academicSemester.year
    ) {
        currentId = lastStudentId.substring(6);
    }

    let newStudentFourDigitNumber = (Number(currentId) + 1)
        .toString()
        .padStart(4, '0');

    return `${academicSemester.year}${academicSemester.code}${newStudentFourDigitNumber}`;
};
