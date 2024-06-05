import { Schema, model } from 'mongoose';
import {
    TAcademicSemester,
    TSemesterCodes,
    TSemesterMonths,
    TSemesterNames,
} from './academic-semester.interface';

const academicSemesterSchema = new Schema<TAcademicSemester>(
    {
        name: {
            type: String,
            enum: Object.values(TSemesterNames),
            required: true,
        },
        code: {
            type: String,
            enum: Object.values(TSemesterCodes),
            required: true,
        },
        year: { type: String, required: true },
        startMonth: {
            type: String,
            enum: Object.values(TSemesterMonths),
            required: true,
        },
        endMonth: {
            type: String,
            enum: Object.values(TSemesterMonths),
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academicSemesterSchema
);
