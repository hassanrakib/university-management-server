import { Response } from 'express';

interface ResponseData<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}

export default function <T>(res: Response, data: ResponseData<T>) {
    res.status(data.statusCode).json(data);
}
