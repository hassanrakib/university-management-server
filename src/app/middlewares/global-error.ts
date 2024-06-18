import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { ErrorSources } from '../interface/error';
import config from '../config';

const handleZodError = (error: ZodError) => {
    const errorSources: ErrorSources = error.issues.map((issue: ZodIssue) => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));
    return {
        statusCode: 400,
        message: 'Validation error',
        errorSources,
    };
};

const globalError: ErrorRequestHandler = (error, req, res, next) => {
    // setting default values
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Something went wrong!';

    let errorSources: ErrorSources = [
        {
            path: '',
            message: 'Something went wrong!',
        },
    ];

    if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);

        // override default values
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.NODE_ENV === 'development' ? error.stack : null,
    });
};

export default globalError;
