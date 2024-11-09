import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

export const createToken = (
    payload: { userId: string; role: string },
    secretKey: string,
    expiresIn: string
) => {
    return jwt.sign(payload, secretKey, {
        expiresIn,
    });
};

export const verifyToken = (token: string, secretKey: string) => {
    // verify the token
    try {
        return jwt.verify(token, secretKey) as JwtPayload;
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access!');
    }
};
