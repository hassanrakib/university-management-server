import { ZodError, ZodIssue } from 'zod';
import { ErrorSources } from '../interface/error';

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

export default handleZodError;
