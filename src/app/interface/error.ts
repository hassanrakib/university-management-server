import { MongooseError } from 'mongoose';
import { ZodError } from 'zod';

export type ErrorSources = {
    path: string | number;
    message: string;
}[];

export type LibraryErrorHandlerReturn = {
    statusCode: number;
    message: string;
    errorSources: ErrorSources;
};
