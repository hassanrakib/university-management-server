import { Types } from 'mongoose';
import Student from './student.interface';
import { StudentModel } from './student.model';

async function insertStudentToDb(student: Student) {
    return await StudentModel.create(student);
}

async function getStudent(id: string) {
    return await StudentModel.findOne({ _id: new Types.ObjectId(id) });
}

export const StudentServices = { insertStudentToDb, getStudent };
