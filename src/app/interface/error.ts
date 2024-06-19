export type ErrorSources = {
    path: string | number;
    message: string;
}[];

export type GenericErrorResponse = {
    statusCode: number;
    message: string;
    errorSources: ErrorSources;
};

export type Error11000 = {
    message: string;
    keyValue: {
        [key: string]: string;
    };
};
