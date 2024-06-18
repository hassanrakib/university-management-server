import mongoose from 'mongoose';
import { ErrorSources, LibraryErrorHandlerReturn } from '../interface/error';

const handleValidationError = (
    err: mongoose.Error.ValidationError
): LibraryErrorHandlerReturn => {
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
