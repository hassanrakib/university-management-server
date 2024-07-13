import express from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academic-semester/academic-semester.route';
import { AcademicFacultyRoutes } from '../modules/academic-faculty/academic-faculty.route';
import { AcademicDepartmentRoutes } from '../modules/academic-department/academic-department.routes';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { CourseRoutes } from '../modules/course/course.route';
import { SemesterRegistrationRoutes } from '../modules/semester-registration/semester-registration.route';
import { OfferedCourseRoutes } from '../modules/offered-course/offered-course.router';
import { AuthRoutes } from '../modules/auth/auth.route';

export const router = express.Router();

const moduleRoutes = [
    {
        path: '/students',
        route: StudentRoutes,
    },
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/academic-semesters',
        route: AcademicSemesterRoutes,
    },
    {
        path: '/academic-faculties',
        route: AcademicFacultyRoutes,
    },
    {
        path: '/academic-departments',
        route: AcademicDepartmentRoutes,
    },
    {
        path: '/faculties',
        route: FacultyRoutes,
    },
    {
        path: '/admins',
        route: AdminRoutes,
    },
    {
        path: '/courses',
        route: CourseRoutes,
    },
    {
        path: '/semester-registrations',
        route: SemesterRegistrationRoutes,
    },
    {
        path: '/offered-courses',
        route: OfferedCourseRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
