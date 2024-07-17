import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catch-async';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

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
        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string
        ) as JwtPayload;

        // check if user doesn't exist in the database
        const user = await User.isUserExistByCustomId(decoded.userId);

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'The user is not found!');
        }

        // checking if the user is deleted
        if (user.isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, 'The user is deleted!');
        }
        // check if user status is "blocked"
        if (user.status === 'blocked') {
            throw new AppError(httpStatus.FORBIDDEN, 'The user is blocked!');
        }

        // if jwt token issued before the password change
        if(user.passwordChangedAt && User.isJwtIssuedBeforePasswordChange(user.passwordChangedAt, decoded.iat as number)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access!');
        }

        // check if the right user is trying to access the data
        if (!userRoles.includes(decoded.role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access!');
        }

        // attach decoded data to the req object
        req.user = decoded;
        // now proceed to the next middleware
        next();
    });
};

export default auth;
