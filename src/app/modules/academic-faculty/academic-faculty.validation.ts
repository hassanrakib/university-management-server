import { z } from 'zod';

const AcademicFacultyValidationSchema = z.object({
    body: z.object({
        name: z.string(),
    }),
});

export const AcademicFacultyValidations = {
    AcademicFacultyValidationSchema,
};
