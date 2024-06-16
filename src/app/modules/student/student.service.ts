import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import TStudent from './student.interface';

async function getAStudentById(id: string) {
    return await Student.findOne({ id })
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty',
            },
        });
}

async function getAllStudents() {
    return await Student.find()
        .populate('admissionSemester')
        .populate('academicDepartment');
}

async function updateAStudentById(
    id: string,
    studentDocPart: Partial<TStudent>
) {
    // differentiate non-primitive values
    const { name, guardian, localGuardian, ...remainingData } = studentDocPart;

    const modifiedStudent: Record<string, unknown> = {
        ...remainingData,
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedStudent[`name.${key}`] = value;
        }
    }
    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedStudent[`guardian.${key}`] = value;
        }
    }

    if (localGuardian && Object.keys(localGuardian)) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedStudent[`localGuardian.${key}`] = value;
        }
    }

    return await Student.findOneAndUpdate({ id }, modifiedStudent, {
        new: true,
        runValidators: true,
    });
}

async function markStudentDeleted(id: string) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const deletedStudent = await Student.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        );

        if (!deletedStudent) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'failed to delete the student!'
            );
        }

        const deletedUser = await User.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        );

        if (!deletedUser) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'failed to delete the user!'
            );
        }

        session.commitTransaction();
        session.endSession();
        return deletedStudent;
    } catch (err) {
        session.abortTransaction();
        session.endSession();
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'failed to delete'
        );
    }
}

export const StudentServices = {
    getAStudentById,
    getAllStudents,
    updateAStudentById,
    markStudentDeleted,
};
