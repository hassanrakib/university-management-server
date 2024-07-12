import { Types } from "mongoose";

export enum Days {
    SUN = "SUN",
    MON = "MON",
    TUE = "TUE",
    WED = "WED",
    THU = "THU",
    FRI = "FRI",
    SAT = "SAT"
}



export interface TOfferedCourse {
    semesterRegistration: Types.ObjectId;
    academicSemester?: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    academicDepartment: Types.ObjectId;
    course: Types.ObjectId;
    faculty: Types.ObjectId;
    maxCapacity: number;
    section: number;
    days: Days[];
    startTime: string;
    endTime: string;
}

export interface TSchedule {
    days: Days[];
    startTime: string;
    endTime: string;
}