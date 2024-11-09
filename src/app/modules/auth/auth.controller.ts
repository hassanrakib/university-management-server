import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);

    const { refreshToken, accessToken, needsPasswordChange } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        // sameSite: 'none',
        // maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User is logged in successfully!',
        data: {
            accessToken,
            needsPasswordChange,
        },
    });
});

const changePassword = catchAsync(async (req, res) => {
    // decoded data set by auth middleware
    const { userId } = req.user;

    const result = await AuthServices.changePassword(userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password is changed successfully!',
        data: result,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const {refreshToken} = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'New access token generated!',
        data: result,
    });
})

const forgetPassword = catchAsync(async (req, res) => {
    const result = await AuthServices.forgetPassword(req.body.id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password reset link generated!',
        data: result,
    });
})

const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization!;
    const result = await AuthServices.resetPassword(req.body, token);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password reseted successfully!',
        data: result,
    });
})

export const AuthController = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
