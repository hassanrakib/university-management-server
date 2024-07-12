import { z } from 'zod';
import { Days } from './offered-course.interface';

const createOfferedCourseSchema = z.object({
    body: z
        .object({
            semesterRegistration: z.string(),
            academicFaculty: z.string(),
            academicDepartment: z.string(),
            course: z.string(),
            faculty: z.string(),
            maxCapacity: z.number(),
            section: z.number(),
            days: z.array(z.nativeEnum(Days)),
            startTime: z.string().refine(
                (time) => {
                    return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);
                },
                { message: 'startTime has to be in HH:MM format!' }
            ),
            endTime: z.string().refine(
                (time) => {
                    return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);
                },
                { message: 'endTime has to be in HH:MM format!' }
            ),
        })
        .refine((body) => {
            const start = new Date(`1970-01-01T${body.startTime}:00`);
            const end = new Date(`1970-01-01T${body.endTime}:00`);

            return end > start;
        }, {message: `startTime can not be less or equal to startTime property`}),
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
