import { Response } from 'express';

interface ResponseData<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta?: {
        totalDocuments: number;
        page: number;
        limit: number;
        totalPage: number;
    };
}

export default function <T>(res: Response, data: ResponseData<T>) {
    res.status(data.statusCode).json(data);
}
