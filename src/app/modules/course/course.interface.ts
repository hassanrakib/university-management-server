import { Types } from 'mongoose';

export type TPreRequisiteCourse = {
    course: Types.ObjectId;
    isDeleted: Boolean;
};

export default interface TCourse {
    title: string;
    prefix: string;
    code: number;
    credits: number;
    preRequisiteCourses?: TPreRequisiteCourse[];
    isDeleted?: boolean;
}

// coursefaculties collection
export interface TCourseFaculty {
    course: Types.ObjectId;
    faculties: Types.ObjectId[];
}
