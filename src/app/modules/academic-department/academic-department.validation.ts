import { z } from 'zod';

const createAcademicDepartmentSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Academic Department name is required',
        }),
        academicFaculty: z.string({
            required_error: 'Academic Faculty Id is required',
        }),
    }),
});

const updateAcademicDepartmentSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Academic Department name is required',
            })
            .optional(),
        academicFaculty: z
            .string({
                required_error: 'Academic Faculty Id is required',
            })
            .optional(),
    }),
});

export const AcademicDepartmentValidations = {
    createAcademicDepartmentSchema,
    updateAcademicDepartmentSchema,
};
