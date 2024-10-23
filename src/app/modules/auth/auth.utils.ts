import jwt, { JwtPayload } from 'jsonwebtoken';

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
    return jwt.verify(token, secretKey) as JwtPayload;
};
