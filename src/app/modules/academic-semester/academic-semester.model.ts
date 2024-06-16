import { Schema, model } from 'mongoose';
import {
    TAcademicSemester,
    TSemesterCodes,
    TSemesterMonths,
    TSemesterNames,
} from './academic-semester.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

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

// validate if a semester exists or not
academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExist = await AcademicSemester.findOne({
        name: this.name,
        year: this.year,
    });

    if (isSemesterExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Semester already exists!');
    }
    next();
});

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academicSemesterSchema
);
