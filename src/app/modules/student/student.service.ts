import Student from './student.interface';
import { StudentModel } from './student.model';

async function insertStudentToDb(student: Student) {
    return await StudentModel.create(student);
}

export const StudentServices = { insertStudentToDb };
