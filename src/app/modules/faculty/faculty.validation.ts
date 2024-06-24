import { z } from 'zod';

const createFacultyNameSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: 'Last name is required' }),
});

const createFacultySchema = z.object({
    body: z.object({
        password: z.string().optional(),
        faculty: z.object({
            designation: z
                .string()
                .min(1, { message: 'Designation is required' }),
            name: createFacultyNameSchema,
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
            profileImg: z.string().optional(),
            academicFaculty: z
                .string()
                .min(1, { message: 'Academic faculty is required' }),
            academicDepartment: z
                .string()
                .min(1, { message: 'Academic department is required' }),
            isDeleted: z.boolean().default(false),
        }),
    }),
});

// Define the TFacultyName type
const updateFacultyNameSchema = z.object({
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

// Define the TFaculty type
const updateFacultySchema = z.object({
    body: z.object({
        password: z.string().optional(),
        faculty: z
            .object({
                designation: z
                    .string()
                    .min(1, { message: 'Designation is required' })
                    .optional(),
                name: updateFacultyNameSchema.optional(),
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
                academicFaculty: z
                    .string()
                    .min(1, { message: 'Academic faculty is required' })
                    .optional(), // Assuming ObjectId is a string, adjust if necessary
                academicDepartment: z
                    .string()
                    .min(1, { message: 'Academic department is required' })
                    .optional(), // Assuming ObjectId is a string, adjust if necessary
                isDeleted: z.boolean().default(false).optional(),
            })
            .optional(),
    }),
});

export const FacultyValidations = {
    createFacultySchema,
    updateFacultySchema,
};
