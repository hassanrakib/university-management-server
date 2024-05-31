export default interface TUser {
    id: string;
    password: string;
    needsPasswordChange?: boolean;
    role: 'student' | 'faculty' | 'admin';
    isDeleted?: boolean;
    status?: 'in-progress' | 'blocked';
}
