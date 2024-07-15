import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
    {
        id: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        needsPasswordChange: { type: Boolean, default: true },
        passwordChangedAt: {
            type: Date
        },
        role: {
            type: String,
            required: true,
            enum: ['student', 'faculty', 'admin'],
        },
        status: {
            type: String,
            enum: ['in-progress', 'blocked'],
            default: 'in-progress',
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    const user = this;
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    );

    next();
});

userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

// statics
userSchema.statics.isUserExistByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
