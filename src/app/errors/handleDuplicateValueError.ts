import { Error11000, GenericErrorResponse } from '../interface/error';

const handleDuplicateValueError = (error: Error11000): GenericErrorResponse => {
    const errorSources = [
        {
            path: Object.keys(error.keyValue)[0],
            message: error.message,
        },
    ];

    return {
        statusCode: 400,
        message: 'Duplicate value',
        errorSources,
    };
};

export default handleDuplicateValueError;
