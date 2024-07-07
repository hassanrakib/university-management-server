import { model, Schema } from 'mongoose';
import {
    Status,
    TSemesterRegistration,
} from './semester-registration.interface';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
    {
        academicSemester: {
            type: Schema.Types.ObjectId,
            unique: true,
            required: true,
            ref: 'AcademicSemester',
        },
        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.UPCOMING,
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        minCredit: { type: Number, default: 3 },
        maxCredit: { type: Number, default: 15 },
    },
    {
        timestamps: true,
    }
);

export const SemesterRegistration = model<TSemesterRegistration>(
    'SemesterRegistration',
    semesterRegistrationSchema
);
