import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const validateRequest = <T>(schema: ZodSchema<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({ body: req.body });
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default validateRequest;
