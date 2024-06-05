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

export const AcademicSemesterValidations = {
    CreateAcademicSemesterSchema,
};
