import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import TUser from './user.interface';
import config from '../../config';

const userSchema = new Schema<TUser>(
    {
        id: { type: String, required: true },
        password: { type: String, required: true },
        needsPasswordChange: { type: Boolean, default: true },
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

export const User = model<TUser>('User', userSchema);
