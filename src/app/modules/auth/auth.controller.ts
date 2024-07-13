import httpStatus from "http-status";
import catchAsync from "../../utils/catch-async";
import sendResponse from "../../utils/send-response";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User is logged in successfully!',
        data: result,
    })
})


export const AuthController = {
    loginUser,
}