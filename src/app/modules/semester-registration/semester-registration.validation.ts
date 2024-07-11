import { z } from 'zod';
import { Status } from './semester-registration.interface';

const createSemesterRegistrationSchema = z.object({
    body: z.object({
        academicSemester: z.string(),
        status: z.nativeEnum(Status).optional(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        minCredit: z.number().optional(),
        maxCredit: z.number().optional(),
    }),
});

const updateSemesterRegistrationSchema = z.object({
    body: z.object({
        academicSemester: z.string().optional(),
        status: z.nativeEnum(Status).optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        minCredit: z.number().optional(),
        maxCredit: z.number().optional(),
    }),
});

export const SemesterRegistrationValidations = {
    createSemesterRegistrationSchema,
    updateSemesterRegistrationSchema,
};
