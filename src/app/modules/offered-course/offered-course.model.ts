import { model, Schema } from 'mongoose';
import { Days, TOfferedCourse } from './offered-course.interface';

const offeredCourseSchema = new Schema<TOfferedCourse>({
    semesterRegistration: {
        type: Schema.Types.ObjectId,
        ref: 'SemesterRegistration',
        required: true,
    },
    academicSemester: {
        type: Schema.Types.ObjectId,
        ref: "AcademicSemester",
        required: true,
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        ref: "AcademicDepartment",
        required: true,
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: "AcademicFaculty",
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    faculty: {
        type: Schema.Types.ObjectId,
        ref: "Faculty",
        required: true,
    },
    days: {
        type: String,
        enum: Object.values(Days),
        required: true,
    },
    maxCapacity: {
        type: Number,
        required: true,
    },
    section: {
        type: Number,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});


export const OfferedCourse = model<TOfferedCourse>("OfferedCourse", offeredCourseSchema);
