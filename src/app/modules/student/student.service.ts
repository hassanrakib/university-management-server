import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import TStudent from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

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

async function getAllStudents(query: Record<string, unknown>) {
    /* // search functionality
    const searchTerm = query.searchTerm || '';
    const studentSearchableFields = [
        'email',
        'name.firstName',
        'presentAddress',
    ];
    const searchQuery = Student.find({
        $or: studentSearchableFields.map((field) => ({
            [field]: { $regex: searchTerm, $options: 'i' },
        })),
    });

    // filter functionality

    // copy query obj to mutate
    const filter = { ...query };
    const excludedFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    excludedFields.forEach((field) => delete filter[field]);

    const filterQuery = searchQuery
        .find(filter)
        .populate('admissionSemester')
        .populate('academicDepartment');

    // sort functionality
    const sort: string = (query.sort as string) || '-createdAt';

    const sortQuery = filterQuery.sort(sort);

    // pagination functionality
    const page = Number(query.page as string) || 1;
    const limit = Number(query.limit as string) || 10;
    const skip = (page - 1) * limit;
    // skip
    const paginateQuery = sortQuery.skip(skip);

    // limit
    const limitQuery = paginateQuery.limit(limit);

    // field limiting

    // make an array of field names by splitting them using comma
    // then join the array elements using space
    // so that it looks like 'name email'
    const fields = (query.fields as string)?.split(',').join(' ') || '';

    const fieldLimitingQuery = await paginateQuery.select(fields);

    return fieldLimitingQuery; */

    // class implementation (recommended)

    const studentQuery = new QueryBuilder(Student.find(), query)
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await studentQuery.modelQuery
        .populate('user')
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty',
            },
        });

    const meta = await studentQuery.countTotal();

    return { meta, result };
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

        const userId = deletedStudent.user;

        const deletedUser = await User.findOneAndUpdate(
            { _id: userId },
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
