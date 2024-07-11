import { TOfferedCourse } from './offered-course.interface';
import { OfferedCourse } from './offered-course.model';

const createOfferedCourseIntoDB = async (offeredCourse: TOfferedCourse) => {
    return await OfferedCourse.create(offeredCourse);
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
};
