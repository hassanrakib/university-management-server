import { z } from 'zod';

const updateUserStatusSchema = z.object({
    body: z.object({
        status: z.enum(['in-progress', 'blocked']),
    }),
});

export const UserValidations = {
    updateUserStatusSchema,
};
