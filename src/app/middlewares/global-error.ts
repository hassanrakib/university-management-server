import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ErrorSources } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateValueError from '../errors/handleDuplicateValueError';
import AppError from '../errors/AppError';

const globalError: ErrorRequestHandler = (error, req, res, next) => {
    // setting default values
    let statusCode = 500;
    let message = 'Something went wrong!';

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
    } else if (error.name === 'CastError') {
        const simplifiedMongooseCastError = handleCastError(error);
        statusCode = simplifiedMongooseCastError.statusCode;
        message = simplifiedMongooseCastError.message;
        errorSources = simplifiedMongooseCastError.errorSources;
    } else if (error.code === 11000) {
        const simplifiedMongoose11000Error = handleDuplicateValueError(error);
        statusCode = simplifiedMongoose11000Error.statusCode;
        message = simplifiedMongoose11000Error.message;
        errorSources = simplifiedMongoose11000Error.errorSources;
    } else if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        errorSources = [
            {
                path: '',
                message: error.message,
            },
        ];
    } else if (error instanceof Error) {
        message = error.message;
        errorSources = [
            {
                path: '',
                message: error.message,
            },
        ];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.NODE_ENV === 'development' ? error.stack : null,
        error,
    });
};

export default globalError;
