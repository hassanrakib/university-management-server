import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catch-async';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

const auth = (...userRoles: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers?.authorization;

        // if token is given to access protected resources
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access!');
        }

        // verify token using jwt
        jwt.verify(
            token,
            config.jwt_access_secret as string,
            function (err, decoded) {
                //    if the token is not valid
                if (err) {
                    throw new AppError(
                        httpStatus.UNAUTHORIZED,
                        'Unauthorized Access!'
                    );
                }

                // check if the right user is trying to access the data
                if (!userRoles.includes((decoded as JwtPayload).role)) {
                    throw new AppError(
                        httpStatus.UNAUTHORIZED,
                        'Unauthorized Access!'
                    );
                }

                // attach decoded data to the req object
                req.user = decoded as JwtPayload;
                // now proceed to the next middleware
                next();
            }
        );
    });
};

export default auth;
