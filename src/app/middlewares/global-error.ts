import { NextFunction, Request, Response } from 'express';

export default function globalError(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(500).json({
        success: false,
        message: (error as Error)?.message || 'Something went wrong!',
        error,
    });
}
