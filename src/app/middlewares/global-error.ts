import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';

export default function globalError(
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(error.statusCode).json({
        success: false,
        message: error.message || 'Something went wrong!',
        error,
    });
}
