import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginCredentials } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';

const loginUser = async (loginCredentials: TLoginCredentials) => {
    // check if user doesn't exist in the database
    const user = await User.isUserExistByCustomId(loginCredentials.id);

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

    // check that password is matched to the hashed password
    if (
        !(await User.isPasswordMatched(
            loginCredentials.password,
            user.password
        ))
    ) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password is wrong!');
    }

    // Access Granted: Send Access Token, Refresh Token

    const jwtPayload = { userId: user.id, role: user.role };

    // create access token and send to the client
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );

    // create refresh token and send to the client
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user.needsPasswordChange,
    };
};

const changePassword = async (
    userId: string,
    password: { oldPassword: string; newPassword: string }
) => {
    // check if user doesn't exist in the database
    const user = await User.isUserExistByCustomId(userId);

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

    // check that password is matched to the hashed password
    if (!(await User.isPasswordMatched(password.oldPassword, user.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Old password did not match!');
    }

    // hash the new password before replacing
    const newHashedPassword = await bcrypt.hash(
        password.newPassword,
        Number(config.bcrypt_salt_rounds)
    );

    return await User.updateOne(
        { id: user.id },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        }
    );
};

export const AuthServices = {
    loginUser,
    changePassword,
};
