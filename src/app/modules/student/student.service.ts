import TStudent from './student.interface';
import { Student } from './student.model';

async function insertStudentToDb(studentData: TStudent) {
    // for static use

    if (await Student.isStudentExist(studentData.id)) {
        throw new Error('Student already exists');
    }

    return await Student.create(studentData);

    // for instance use

    // const student = new Student(studentData);

    // if (await student.isStudentExist(student.id)) {
    //     throw new Error('Student already exists!');
    // }

    // return await student.save();
}

async function getStudent(id: string) {
    // return await Student.findOne({ _id: new Types.ObjectId(id) });
    return await Student.aggregate([{ $match: { id } }]);
}

async function markStudentDeleted(id: string) {
    return await Student.updateOne({ id }, { isDeleted: true });
}

export const StudentServices = {
    insertStudentToDb,
    getStudent,
    markStudentDeleted,
};
