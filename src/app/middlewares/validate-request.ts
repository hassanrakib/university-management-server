import { ZodSchema } from 'zod';
import catchAsync from '../utils/catch-async';

const validateRequest = <T>(schema: ZodSchema<T>) => {
    return catchAsync(async (req, res, next) => {
        await schema.parseAsync({ body: req.body, cookies: req.cookies });
        next();
    })
};

export default validateRequest;
