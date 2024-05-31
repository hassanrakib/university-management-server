import { NextFunction, Request, Response } from 'express';

export default function globalError(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(500).json({
        success: false,
        message: error.message || 'Something went wrong!',
        error,
    });
}
