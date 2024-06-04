import { z } from 'zod';
import validator from 'validator';
import { TBloodGroup } from './student.interface';

// Define a schema for name validation
const NameSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1)
        .max(20)
        .regex(/^[A-Z][a-z]*$/, {
            message: 'name.firstName is not valid',
        }),
    middleName: z.string().optional(),
    lastName: z.string().refine((val) => validator.isAlpha(val), {
        message: 'name.lastName is not valid',
    }),
});

// Define a schema for guardian validation
const GuardianSchema = z.object({
    fatherName: z.string().min(1),
    fatherOccupation: z.string().min(1),
    fatherContactNo: z.string().min(1),
    motherName: z.string().min(1),
    motherOccupation: z.string().min(1),
    motherContactNo: z.string().min(1),
});

// Define a schema for local guardian validation
const LocalGuardianSchema = z.object({
    name: z.string().min(1),
    occupation: z.string().min(1),
    contactNo: z.string().min(1),
    address: z.string().min(1),
});

// Define a schema for student validation
const CreateStudentSchema = z.object({
    body: z.object({
        password: z.string().max(20),
        student: z.object({
            name: NameSchema,
            gender: z.enum(['male', 'female']),
            dateOfBirth: z.string().optional(),
            email: z.string().email(),
            contactNo: z.string().min(1),
            emergencyContactNo: z.string().min(1),
            bloodGroup: z.nativeEnum(TBloodGroup).optional(),
            presentAddress: z.string().min(1),
            permanentAddress: z.string().min(1),
            guardian: GuardianSchema,
            localGuardian: LocalGuardianSchema,
            profileImg: z.string().optional(),
        }),
    }),
});

export const studentValidations = {
    CreateStudentSchema,
};
