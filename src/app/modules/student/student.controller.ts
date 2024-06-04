import { StudentServices } from './student.service';
import sendResponse from '../../utils/send-response';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';

const fetchStudent = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const studentData = await StudentServices.getStudent(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: httpStatus[200],
        data: studentData,
    });
});

const deleteStudent = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedData = await StudentServices.markStudentDeleted(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: httpStatus[200],
        data: deletedData,
    });
});

export const StudentControllers = {
    fetchStudent,
    deleteStudent,
};
