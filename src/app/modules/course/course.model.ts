import { Schema, model } from 'mongoose';
import TCourse, {
    TCourseFaculty,
    TPreRequisiteCourse,
} from './course.interface';

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourse>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

const courseSchema = new Schema<TCourse>({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    prefix: {
        type: String,
        trim: true,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    },
    preRequisiteCourses: {
        type: [preRequisiteCourseSchema],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

const courseFacultySchema = new Schema<TCourseFaculty>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        unique: true,
        required: true,
    },
    faculties: {
        type: [Schema.Types.ObjectId],
        ref: 'Faculty',
        required: true,
    },
});

export const Course = model<TCourse>('Course', courseSchema);
export const CourseFaculty = model<TCourseFaculty>(
    'CourseFaculty',
    courseFacultySchema
);
