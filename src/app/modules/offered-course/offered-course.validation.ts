import { z } from 'zod';
import { Days } from './offered-course.interface';

const createOfferedCourseSchema = z.object({
    body: z.object({
        semesterRegistration: z.string(),
        academicSemester: z.string(),
        academicFaculty: z.string(),
        academicDepartment: z.string(),
        course: z.string(),
        faculty: z.string(),
        maxCapacity: z.number(),
        section: z.number(),
        days: z.nativeEnum(Days),
        startTime: z.string(),
        endTime: z.string(),
    }),
});

const updateOfferedCourseSchema = z.object({
    body: z.object({
        faculty: z.string().optional(),
        maxCapacity: z.number().optional(),
        days: z.nativeEnum(Days).optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
    }),
});

export const OfferedCourseValidations = {
    createOfferedCourseSchema,
    updateOfferedCourseSchema,
};
