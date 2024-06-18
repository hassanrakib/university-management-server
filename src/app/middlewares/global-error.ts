import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ErrorSources } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';

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
        const simplifiedZodError = handleZodError(error);

        // override default values
        statusCode = simplifiedZodError.statusCode;
        message = simplifiedZodError.message;
        errorSources = simplifiedZodError.errorSources;
    } else if (error.name === 'ValidationError') {
        const simplifiedMongooseError = handleValidationError(error);
        statusCode = simplifiedMongooseError.statusCode;
        message = simplifiedMongooseError.message;
        errorSources = simplifiedMongooseError.errorSources;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.NODE_ENV === 'development' ? error.stack : null,
    });
};

export default globalError;
