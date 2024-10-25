import { z } from 'zod';

const createEnrolledCourseSchema = z.object({
    body: z.object({
        offeredCourse: z.string(),
    }),
});

export const EnrolledCourseValidations = {
    createEnrolledCourseSchema,
};
