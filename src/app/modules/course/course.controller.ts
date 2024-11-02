import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { CourseService } from './course.service';

const getAllCourses = catchAsync(async (req, res, next) => {
    const courses = await CourseService.fetchCoursesFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Courses fetched successfully!',
        data: courses,
    });
});

const getCourseById = catchAsync(async (req, res, next) => {
    const result = await CourseService.fetchCourseByIdFromDB(
        req.params.courseId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course fetched successfully!',
        data: result,
    });
});

const createCourse = catchAsync(async (req, res, next) => {
    const result = await CourseService.insertCourseIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course created successfully!',
        data: result,
    });
});

const updateCourseById = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;
    const result = await CourseService.updateCourseIntoDB(courseId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course updated successfully!',
        data: result,
    });
});

const deleteCourseById = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;
    const result = await CourseService.deleteCourseFromDB(courseId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course deleted successfully!',
        data: result,
    });
});

const assignFacultiesWithCourse = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;
    const { faculties } = req.body;

    const result = await CourseService.assignFacultiesWithCourseIntoDB(
        courseId,
        faculties
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties assignment successful',
        data: result,
    });
});

const getCourseFaculties = catchAsync(async (req, res) => {
    const { courseId } = req.params;

    const result = await CourseService.getCourseFacultiesFromDB(courseId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties retrieved successfully',
        data: result,
    });
});

const removeFacultiesFromCourse = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;
    const { faculties } = req.body;

    const result = await CourseService.removeFacultiesFromCourseFromDB(
        courseId,
        faculties
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties removed successfully',
        data: result,
    });
});

export const CourseController = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourseById,
    deleteCourseById,
    assignFacultiesWithCourse,
    getCourseFaculties,
    removeFacultiesFromCourse,
};
