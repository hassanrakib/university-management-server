import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginCredentials } from './auth.interface';
import bcrypt from 'bcrypt';

const loginUser = async (loginCredentials: TLoginCredentials) => {
    // check if user doesn't exist in the database
    const isUserExist = await User.isUserExistByCustomId(loginCredentials.id);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'The user is not found!');
    }

    // checking if the user is deleted
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'The user is deleted!');
    }
    // check if user status is "blocked"
    if (isUserExist.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'The user is blocked!');
    }

    // check that password is matched to the hashed password
    if (
        !(await User.isPasswordMatched(
            loginCredentials.password,
            isUserExist.password
        ))
    ) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password is wrong!');
    }

    // Access Granted: Send Access Token, Refresh Token

    return {};
};

export const AuthServices = {
    loginUser,
};
