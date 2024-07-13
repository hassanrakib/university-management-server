import { Model } from 'mongoose';

export interface TUser {
    id: string;
    password: string;
    needsPasswordChange?: boolean;
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
}
