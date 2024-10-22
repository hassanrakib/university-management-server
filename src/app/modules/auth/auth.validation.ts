import { string } from 'joi';
import { z } from 'zod';

const loginCredentialsSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'Id is required!' }),
        password: z.string({ required_error: 'Password is required!' }),
    }),
});

const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old password is required!' }),
        newPassword: z.string({ required_error: 'New password is required!' }),
    }),
});

const refreshTokenSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});

const forgetPasswordSchema = z.object({
    body: z.object({
        id: z.string({
            required_error: 'User id is required!',
        }),
    }),
});

export const AuthValidation = {
    loginCredentialsSchema,
    changePasswordSchema,
    refreshTokenSchema,
    forgetPasswordSchema,
};
