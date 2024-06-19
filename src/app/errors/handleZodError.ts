import { ZodError, ZodIssue } from 'zod';
import { ErrorSources, GenericErrorResponse } from '../interface/error';

const handleZodError = (error: ZodError): GenericErrorResponse => {
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

export default handleZodError;
