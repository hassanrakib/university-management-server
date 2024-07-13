import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';
import sendResponse from '../../utils/send-response';
import { OfferedCourseServices } from './offered-course.service';


const getAllOfferedCourses = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getOfferedCoursesFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Offered courses fetched successfully!',
        data: result,
    });
})

const getOfferedCourseById = catchAsync(async (req, res) => {
   const {id} = req.params;
    const result = await OfferedCourseServices.getOfferedCourseByIdFromDB(id);
   
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Offered courses fetched successfully!',
        data: result,
    });
})

const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Offered course created successfully!',
        data: result,
    });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
        id,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Offered course updated successfully!',
        data: result,
    });
});

const deleteOfferedCourseById = catchAsync(async (req, res) => {
    const {id} = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourseByIdFromDB(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Offered courses deleted successfully!',
        data: result,
    });
})

export const OfferedCourseController = {
    getAllOfferedCourses,
    getOfferedCourseById,
    createOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourseById,
};
