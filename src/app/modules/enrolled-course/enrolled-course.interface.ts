import { Types } from 'mongoose';

export enum Grade {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    F = 'F',
    NA = 'NA',
}

export interface TEnrolledCourseMarks {
    classTest1: number;
    midTerm: number;
    classTest2: number;
    finalTerm: number;
}

export interface TEnrolledCourse {
    semesterRegistration: Types.ObjectId;
    academicSemester: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    academicDepartment: Types.ObjectId;
    offeredCourse: Types.ObjectId;
    course: Types.ObjectId;
    student: Types.ObjectId;
    faculty: Types.ObjectId;
    isEnrolled?: boolean;
    courseMarks?: TEnrolledCourseMarks;
    grade?: Grade;
    gradePoints?: number;
    isCompleted?: boolean;
}
