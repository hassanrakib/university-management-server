import { z } from 'zod';

const createAdminNameSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: 'Last name is required' }),
});

const createAdminSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        admin: z.object({
            designation: z
                .string()
                .min(1, { message: 'Designation is required' }),
            name: createAdminNameSchema,
            email: z.string().email(),
            gender: z.enum(['male', 'female'], {
                required_error: 'Gender is required',
            }),
            dateOfBirth: z.string().optional(),
            contactNo: z
                .string()
                .min(1, { message: 'Contact number is required' }),
            emergencyContactNo: z
                .string()
                .min(1, { message: 'Emergency contact number is required' }),
            presentAddress: z
                .string()
                .min(1, { message: 'Present address is required' }),
            permanentAddress: z
                .string()
                .min(1, { message: 'Permanent address is required' }),
            isDeleted: z.boolean().default(false),
        }),
    }),
});

const updateAdminNameSchema = z.object({
    firstName: z
        .string()
        .min(1, { message: 'First name is required' })
        .optional(),
    middleName: z.string().optional(),
    lastName: z
        .string()
        .min(1, { message: 'Last name is required' })
        .optional(),
});

const updateAdminSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        admin: z
            .object({
                designation: z
                    .string()
                    .min(1, { message: 'Designation is required' })
                    .optional(),
                name: updateAdminNameSchema.optional(),
                email: z.string().email(),
                gender: z
                    .enum(['male', 'female'], {
                        required_error: 'Gender is required',
                    })
                    .optional(),
                dateOfBirth: z.string().optional(),
                contactNo: z
                    .string()
                    .min(1, { message: 'Contact number is required' })
                    .optional(),
                emergencyContactNo: z
                    .string()
                    .min(1, { message: 'Emergency contact number is required' })
                    .optional(),
                presentAddress: z
                    .string()
                    .min(1, { message: 'Present address is required' })
                    .optional(),
                permanentAddress: z
                    .string()
                    .min(1, { message: 'Permanent address is required' })
                    .optional(),
                profileImg: z.string().optional(),
                managementDepartment: z
                    .string()
                    .min(1, { message: 'Academic department is required' })
                    .optional(),
                isDeleted: z.boolean().default(false).optional(),
            })
            .optional(),
    }),
});

export const AdminValidations = {
    createAdminSchema,
    updateAdminSchema,
};
