import { z } from 'zod';
import { Days } from './offered-course.interface';

const timeStringSchema = z.string().refine(
    (time) => {
        return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);
    },
    { message: 'Time has to be in HH:MM format!' }
);

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
            startTime: timeStringSchema,
            endTime: timeStringSchema,
        })
        .refine(
            (body) => {
                const start = new Date(`1970-01-01T${body.startTime}:00`);
                const end = new Date(`1970-01-01T${body.endTime}:00`);

                return end > start;
            },
            {
                message: `startTime can not be less or equal to startTime property`,
            }
        ),
});

const updateOfferedCourseSchema = z.object({
    body: z
        .object({
            faculty: z.string(),
            maxCapacity: z.number(),
            days: z.array(z.nativeEnum(Days)),
            startTime: timeStringSchema,
            endTime: timeStringSchema,
        })
        .refine(
            (body) => {
                const start = new Date(`1970-01-01T${body.startTime}:00`);
                const end = new Date(`1970-01-01T${body.endTime}:00`);

                return end > start;
            },
            {
                message: `startTime can not be less or equal to startTime property`,
            }
        ),
});

export const OfferedCourseValidations = {
    createOfferedCourseSchema,
    updateOfferedCourseSchema,
};
