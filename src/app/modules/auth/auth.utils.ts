import jwt from 'jsonwebtoken';

export const createToken = (
    payload: { userId: string; role: string },
    secretKey: string,
    expiresIn: string
) => {
    return jwt.sign(payload, secretKey, {
        expiresIn,
    });
};
