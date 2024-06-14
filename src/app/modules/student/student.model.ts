import { Schema, model } from 'mongoose';
import validator from 'validator';
import TStudent, {
    TBloodGroup,
    TGuardian,
    TLocalGuardian,
    TName,
    StudentModel,
} from './student.interface';

const nameSchema = new Schema<TName>({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'name.firstName is required'],
        maxlength: [20, 'name.firstName exceeded 20 characters'],
        validate: {
            validator: function (v: string) {
                const idealFirstName = v.charAt(0).toUpperCase() + v.slice(1);
                return v === idealFirstName;
            },
            message: '{VALUE} is not valid',
        },
    },
    middleName: { type: String },
    lastName: {
        type: String,
        required: [true, 'name.lastName is required'],
        validate: {
            validator: (v: string) => validator.isAlpha(v),
            message: '{VALUE} is not valid',
        },
    },
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: {
        type: String,
        required: [true, 'guardian.fatherName is required'],
    },
    fatherOccupation: {
        type: String,
        required: [true, 'guardian.fatherOccupation is required'],
    },
    fatherContactNo: {
        type: String,
        required: [true, 'guardian.fatherContactNo is required'],
    },
    motherName: {
        type: String,
        required: [true, 'guardian.motherName is required'],
    },
    motherOccupation: {
        type: String,
        required: [true, 'guardian.motherOccupation is required'],
    },
    motherContactNo: {
        type: String,
        required: [true, 'guardian.motherContactNo is required'],
    },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: { type: String, required: [true, 'localGuardian.name is required'] },
    occupation: {
        type: String,
        required: [true, 'localGuardian.occupation is required'],
    },
    contactNo: {
        type: String,
        required: [true, 'localGuardian.contactNo is required'],
    },
    address: {
        type: String,
        required: [true, 'localGuardian.address is required'],
    },
});

const studentSchema = new Schema<TStudent, StudentModel>(
    {
        id: {
            type: String,
            required: [true, 'student.id is required'],
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User',
        },
        name: {
            type: nameSchema,
            required: [true, 'student.name is required'],
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female'],
                message: '{VALUE} is not supported',
            },
            required: [true, 'student.gender is required'],
        },
        dateOfBirth: { type: String },
        email: {
            type: String,
            required: [true, 'student.email is required'],
            unique: true,
            validate: {
                validator: function (v: string) {
                    return validator.isEmail(v);
                },
                message: '{VALUE} is not a valid email',
            },
        },
        contactNo: {
            type: String,
            required: [true, 'student.contactNo is required'],
        },
        emergencyContactNo: {
            type: String,
            required: [true, 'student.emergencyContactNo is required'],
        },
        bloodGroup: {
            type: String,
            enum: Object.values(TBloodGroup),
        },
        presentAddress: {
            type: String,
            required: [true, 'student.presentAddress is required'],
        },
        permanentAddress: {
            type: String,
            required: [true, 'student.permanentAddress is required'],
        },
        guardian: {
            type: guardianSchema,
            required: [true, 'student.guardian is required'],
        },
        localGuardian: {
            type: localGuardianSchema,
            required: [true, 'student.localGuardian is required'],
        },
        profileImg: { type: String },
        admissionSemester: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicSemester',
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

// creates a custom instance method
/* 
studentSchema.methods.isStudentExist = async function (id: string) {
    const existingStudent = await Student.findOne({ id });

    return existingStudent;
};
*/

// creates a custom static method
studentSchema.statics.isStudentExist = async function (id: string) {
    return await Student.findOne({ id });
};

studentSchema.pre('findOne', function (next) {
    // filter out the document that is deleted
    this.findOne({ isDeleted: { $ne: true } });
    next();
});

studentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

// virtual field
studentSchema.virtual('fullName').get(function () {
    return this.name.firstName + ' ' + this.name.lastName;
});

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
