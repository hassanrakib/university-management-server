import { Types } from "mongoose";

export enum Status {
    UPCOMING = 'UPCOMING',
    ONGOING = 'ONGOING',
    ENDED = 'ENDED' ,
}

export interface TSemesterRegistration {
    academicSemester: Types.ObjectId;
    status?: Status;
    startDate: Date;
    endDate: Date;
    minCredit?: number;
    maxCredit?: number;
}