import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import TStudent from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
    generateAdminId,
    generateFacultyId,
    generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import TFaculty from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import TAdmin from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { AcademicDepartment } from '../academic-department/academic-department.model';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from './user.constant';

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
            email: studentData.email,
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

        throw error;
    }
}

const insertFacultyToDB = async (password: string, facultyData: TFaculty) => {
    const isAcademicDepartmentExist = await AcademicDepartment.findById(
        facultyData.academicDepartment
    );

    if (!isAcademicDepartmentExist) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Academic department does not exist!'
        );
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const id = await generateFacultyId();

        const user: TUser = {
            id,
            email: facultyData.email,
            password: password || (config.default_password as string),
            role: 'faculty',
        };

        const newUser = await User.create([user], { session });

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
        }

        const faculty = {
            ...facultyData,
            id: newUser[0].id,
            user: newUser[0]._id,
        };

        const newFaculty = await Faculty.create([faculty], { session });

        if (!newFaculty.length) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Faculty creation failed'
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty[0];
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();

        throw error;
    }
};

const insertAdminToDB = async (password: string, adminData: TAdmin) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const id = await generateAdminId();

        const user: TUser = {
            id,
            email: adminData.email,
            password: password || (config.default_password as string),
            role: 'admin',
        };

        const newUser = await User.create([user], { session });

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
        }

        const faculty = {
            ...adminData,
            id: newUser[0].id,
            user: newUser[0]._id,
        };

        const newAdmin = await Admin.create([faculty], { session });

        if (!newAdmin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Admin creation failed');
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin[0];
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();

        throw error;
    }
};

// get me only using token
const getMeFromDB = async (user: JwtPayload) => {
    if (user.role === USER_ROLE.admin) {
        return Admin.findOne({ id: user.userId });
    }
    if (user.role === USER_ROLE.faculty) {
        return Faculty.findOne({ id: user.userId });
    }
    if (user.role === USER_ROLE.student) {
        return Student.findOne({ id: user.userId });
    }
};

export const UserServices = {
    insertStudentToDb,
    insertFacultyToDB,
    insertAdminToDB,
    getMeFromDB,
};
