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
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

async function insertStudentToDb(
    password: string,
    studentData: TStudent,
    file: Express.Multer.File | undefined
) {
    // find academic semester by its id given in the studentData.admissionSemester
    const academicSemester = await AcademicSemester.findById(
        studentData.admissionSemester
    );

    if (!academicSemester)
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Academic Semester not found!'
        );

    // find academic department by its id
    const academicDepartment = await AcademicDepartment.findById(
        studentData.academicDepartment
    );

    if (!academicDepartment)
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Academic Department not found!'
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

        // save profile image to cloudinary and get the url & secure_url
        const imageName = `${studentData.name.firstName}_${studentData.name.lastName}_${id}`;
        const profile_img_url = file
            ? await sendImageToCloudinary(imageName.toLowerCase(), file.path)
            : 'https://www.gravatar.com/avatar/?d=identicon';

        // create user
        const newUser = await User.create([user], { session });

        // if successful in creating user
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'user creation failed!');
        }

        const student: TStudent = {
            ...studentData,
            id: newUser[0].id,
            user: newUser[0]._id,
            profileImg: profile_img_url,
            academicFaculty: academicDepartment.academicFaculty,
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

const insertFacultyToDB = async (
    password: string,
    facultyData: TFaculty,
    file: Express.Multer.File | undefined
) => {
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

        // save profile image to cloudinary and get the url & secure_url
        const imageName = `${facultyData.name.firstName}_${facultyData.name.lastName}_${id}`;
        const profile_img_url = file
            ? await sendImageToCloudinary(imageName.toLowerCase(), file.path)
            : 'https://www.gravatar.com/avatar/?d=identicon';

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

        const faculty: TFaculty = {
            ...facultyData,
            id: newUser[0].id,
            user: newUser[0]._id,
            profileImg: profile_img_url,
            academicFaculty: isAcademicDepartmentExist.academicFaculty,
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

const insertAdminToDB = async (
    password: string,
    adminData: TAdmin,
    file: Express.Multer.File | undefined
) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const id = await generateAdminId();

        // save profile image to cloudinary and get the url & secure_url
        const imageName = `${adminData.name.firstName}_${adminData.name.lastName}_${id}`;
        const profile_img_url = file
            ? await sendImageToCloudinary(imageName.toLowerCase(), file.path)
            : 'https://www.gravatar.com/avatar/?d=identicon';

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

        const admin: TAdmin = {
            ...adminData,
            id: newUser[0].id,
            user: newUser[0]._id,
            profileImg: profile_img_url,
        };

        const newAdmin = await Admin.create([admin], { session });

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
        return Admin.findOne({ id: user.userId }).populate('user');
    }
    if (user.role === USER_ROLE.faculty) {
        return Faculty.findOne({ id: user.userId }).populate('user');
    }
    if (user.role === USER_ROLE.student) {
        return Student.findOne({ id: user.userId }).populate('user');
    }
};

const changeUserStatusIntoDB = async (id: string, status: string) => {
    return await User.findOneAndUpdate(
        { id },
        { status },
        {
            new: true,
            runValidators: true,
        }
    );
};

export const UserServices = {
    insertStudentToDb,
    insertFacultyToDB,
    insertAdminToDB,
    getMeFromDB,
    changeUserStatusIntoDB,
};
