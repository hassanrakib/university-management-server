import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import TStudent from '../student/student.interface';
import { Student } from '../student/student.model';
import TUser from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';

async function insertStudentToDb(password: string, studentData: TStudent) {
    // find academic semester by its id given in the studentData.admissionSemester
    const academicSemester = await AcademicSemester.findById(
        studentData.admissionSemester
    );

    if (!academicSemester)
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Academic Semester not found!'
        );

    // create a mongoose session for transaction
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // generate id
        const id: string = await generateStudentId(academicSemester);

        const user: TUser = {
            id,
            password: password || (config.default_password as string),
            role: 'student',
        };

        // create user
        const newUser = await User.create([user], { session });

        // if successful in creating user
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'user creation failed!');
        }

        const student = {
            ...studentData,
            id: newUser[0].id,
            user: newUser[0]._id,
        };

        const newStudent = await Student.create([student], { session });
        if (!newStudent.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'student creation failed'
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent[0];
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();

        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to save!');
    }
}

export const UserServices = {
    insertStudentToDb,
};
