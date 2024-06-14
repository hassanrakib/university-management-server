import config from '../../config';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import TStudent from '../student/student.interface';
import { Student } from '../student/student.model';
import TUser from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

async function insertStudentToDb(password: string, studentData: TStudent) {
    // find academic semester by its id given in the studentData.admissionSemester
    const academicSemester = await AcademicSemester.findById(
        studentData.admissionSemester
    );

    if (!academicSemester) throw new Error('Academic Semester not found!');

    // generate id
    const id: string = await generateStudentId(academicSemester);

    let user: TUser = {
        id,
        password: password || (config.default_password as string),
        role: 'student',
    };

    // create user
    const newUser = await User.create(user);

    // if successful in creating user
    if (Object.keys(newUser)) {
        const student = {
            ...studentData,
            id: newUser.id,
            user: newUser._id,
        };

        return await Student.create(student);
    }
}

export const UserServices = {
    insertStudentToDb,
};
