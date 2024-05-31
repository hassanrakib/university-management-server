import { Student } from './student.model';

async function getStudent(id: string) {
    // return await Student.findOne({ _id: new Types.ObjectId(id) });
    return await Student.aggregate([{ $match: { id } }]);
}

async function markStudentDeleted(id: string) {
    return await Student.updateOne({ id }, { isDeleted: true });
}

export const StudentServices = {
    getStudent,
    markStudentDeleted,
};
