import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginCredentials } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

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
        config.jwt_refresh_expires_in as string
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

const refreshToken = async (token: string) => {
    // verify token using jwt
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

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
    if (
        user.passwordChangedAt &&
        User.isJwtIssuedBeforePasswordChange(
            user.passwordChangedAt,
            decoded.iat as number
        )
    ) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access!');
    }

    // Access Granted: Send Access Token, Refresh Token

    const jwtPayload = { userId: user.id, role: user.role };

    // create access token and send to the client
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );

    return { accessToken };
};

const forgetPassword = async (id: string) => {
    // check if user doesn't exist in the database
    const user = await User.isUserExistByCustomId(id);

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

    const jwtPayload = { userId: user.id, role: user.role };

    // create access token and send to the client
    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '10m'
    );

    const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;

    const emailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 10px 0;
    }
    .header h1 {
      margin: 0;
      color: #007BFF;
    }
    .content {
      padding: 20px;
    }
    .content p {
      margin: 10px 0;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      background-color: #007BFF;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #777;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hello ${user.role},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href=${resetUILink} class="button">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
      <p>Thanks,<br>The University Management Server Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 University Management Server. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

    // sendEmail(user.email, emailTemplate);
    console.log(resetUILink);
};

const resetPassword = async (
    { id, newPassword }: { id: string; newPassword: string },
    token: string
) => {
    // check if user doesn't exist in the database
    const user = await User.isUserExistByCustomId(id);

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

    // verify the token
    const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
    ) as JwtPayload;

    // check the decoded userId and id sent through the body are same
    if(id !== decoded.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to reset the password!");
    }

    // hash the new password before replacing
    const newHashedPassword = await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt_rounds)
    );

    // update password in the db
    await User.updateOne(
        { id: user.id },
        {
            password: newHashedPassword,
            passwordChangedAt: new Date(),
        }
    );
};

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
