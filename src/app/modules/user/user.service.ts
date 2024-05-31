import config from '../../config';
import TStudent from '../student/student.interface';
import { Student } from '../student/student.model';
import TUser from './user.interface';
import { User } from './user.model';

async function insertStudentToDb(password: string, studentData: TStudent) {
    // generate id
    const id: string = '2024001';

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
