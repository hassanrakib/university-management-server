import mongoose from 'mongoose';
import { ErrorSources, GenericErrorResponse } from '../interface/error';

const handleCastError = (
    error: mongoose.Error.CastError
): GenericErrorResponse => {
    const errorSources: ErrorSources = [
        {
            path: error.path,
            message: error.message,
        },
    ];

    return {
        statusCode: 400,
        message: 'Cast Error',
        errorSources,
    };
};

export default handleCastError;
