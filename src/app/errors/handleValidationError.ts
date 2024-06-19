import mongoose from 'mongoose';
import { ErrorSources, GenericErrorResponse } from '../interface/error';

const handleValidationError = (
    err: mongoose.Error.ValidationError
): GenericErrorResponse => {
    const errorSources: ErrorSources = Object.values(err.errors).map((err) => ({
        path: err.path,
        message: err.message,
    }));
    return {
        statusCode: 400,
        message: 'Validation Error',
        errorSources,
    };
};

export default handleValidationError;
