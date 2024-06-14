import { z } from 'zod';
import {
    TSemesterCodes,
    TSemesterMonths,
    TSemesterNames,
} from './academic-semester.interface';

const CreateAcademicSemesterSchema = z.object({
    body: z.object({
        name: z.nativeEnum(TSemesterNames),
        code: z.nativeEnum(TSemesterCodes),
        year: z.string(),
        startMonth: z.nativeEnum(TSemesterMonths),
        endMonth: z.nativeEnum(TSemesterMonths),
    }),
});

const UpdateAcademicSemesterSchema = z.object({
    body: z.object({
        name: z.nativeEnum(TSemesterNames).optional(),
        code: z.nativeEnum(TSemesterCodes).optional(),
        year: z.string().optional(),
        startMonth: z.nativeEnum(TSemesterMonths).optional(),
        endMonth: z.nativeEnum(TSemesterMonths).optional(),
    }),
});

export const AcademicSemesterValidations = {
    CreateAcademicSemesterSchema,
    UpdateAcademicSemesterSchema,
};
