import { StudentServices } from './student.service';
import sendResponse from '../../utils/send-response';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catch-async';

const fetchStudent = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const studentData = await StudentServices.getAStudentById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: httpStatus[200],
        data: studentData,
    });
});

const fetchAllStudentents = catchAsync(async (req, res, next) => {
    const studentsData = await StudentServices.getAllStudents(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: httpStatus[200],
        data: studentsData,
    });
});

const updateStudent = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedStudent = await StudentServices.updateAStudentById(
        id,
        req.body.student
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student updated successfully!',
        data: updatedStudent,
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
    updateStudent,
    fetchAllStudentents,
};
