import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUserRole = keyof typeof USER_ROLE;

export interface TUser {
    id: string;
    password: string;
    needsPasswordChange?: boolean;
    passwordChangedAt?: Date;
    role: 'student' | 'faculty' | 'admin';
    isDeleted?: boolean;
    status?: 'in-progress' | 'blocked';
}

export interface UserModel extends Model<TUser> {
    isUserExistByCustomId(id: string): Promise<TUser>;
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string
    ): Promise<boolean>;
    isJwtIssuedBeforePasswordChange(
        passwordChangedAt: Date,
        jwtIssuedAt: number
    ): boolean;
}
