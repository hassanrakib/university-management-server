import { z } from 'zod';

const preRequisiteCourseSchema = z.object({
    course: z.string(),
});

const createCourseSchema = z.object({
    body: z.object({
        title: z.string().trim(),
        prefix: z.string().trim(),
        code: z.number(),
        credits: z.number(),
        preRequisiteCourses: z.array(preRequisiteCourseSchema).optional(),
        isDeleted: z.boolean().optional(),
    }),
});

const updatePreRequisiteCourseSchema = z.object({
    course: z.string(),
});

const updateCourseSchema = z.object({
    body: z.object({
        title: z.string().trim().optional(),
        prefix: z.string().trim().optional(),
        code: z.number().optional(),
        credits: z.number().optional(),
        preRequisiteCourses: z.array(updatePreRequisiteCourseSchema).optional(),
        isDeleted: z.boolean().optional(),
    }),
});

export const CourseValidations = {
    createCourseSchema,
    updateCourseSchema,
};
