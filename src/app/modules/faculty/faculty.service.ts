import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { FacultySearchableFields } from './faculty.constant';
import TFaculty from './faculty.interface';
import { Faculty } from './faculty.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const fetchFacultiesFromDB = async (query: Record<string, unknown>) => {
    const facultyQuery = new QueryBuilder(Faculty.find(), query)
        .search(FacultySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await facultyQuery.modelQuery.populate('academicDepartment');

    return result;
};

const fetchFacultyByIdFromDB = async (facultyId: string) => {
    return await Faculty.findOne({ id: facultyId }).populate(
        'academicDepartment'
    );
};

const updateFacultyByIdInDB = async (
    facultyId: string,
    facultyDocPart: Partial<TFaculty>
) => {
    const { name, ...remainingData } = facultyDocPart;

    const modifiedFaculty: Record<string, unknown> = {
        ...remainingData,
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedFaculty[`name.${key}`] = value;
        }
    }

    return await Faculty.findOneAndUpdate({ id: facultyId }, modifiedFaculty, {
        new: true,
        runValidators: true,
    });
};

const deleteFacultyByIdFromDB = async (facultyId: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedFaculty = await Faculty.findOneAndUpdate(
            { id: facultyId },
            { isDeleted: true },
            { new: true, session }
        );

        if (!deletedFaculty) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete faculty'
            );
        }

        // get user _id from deletedFaculty
        const userId = deletedFaculty.user;

        const deletedUser = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true, session }
        );

        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedFaculty;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

export const FacultyService = {
    fetchFacultiesFromDB,
    fetchFacultyByIdFromDB,
    updateFacultyByIdInDB,
    deleteFacultyByIdFromDB,
};
