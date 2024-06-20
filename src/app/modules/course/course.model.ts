import { Schema, model } from 'mongoose';
import TCourse, { TPreRequisiteCourse } from './course.interface';

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourse>({
    course: {
        type: Schema.Types.ObjectId,
        refer: 'Course',
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
});

export const Course = model<TCourse>('Course', courseSchema);
