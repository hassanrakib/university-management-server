import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import TCourse, { TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const insertCourseIntoDB = async (course: TCourse) => {
    return await Course.create(course);
};

const fetchCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find(), query)
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await courseQuery.modelQuery.populate(
        'preRequisiteCourses.course'
    );

    const meta = await courseQuery.countTotal();

    return {meta, result};
};

const fetchCourseByIdFromDB = async (courseId: string) => {
    return await Course.findById(courseId).populate(
        'preRequisiteCourses.course'
    );
};

const updateCourseIntoDB = async (
    courseId: string,
    courseDocPart: Partial<TCourse>
) => {
    const { preRequisiteCourses, ...remainingData } = courseDocPart;

    const session = await mongoose.startSession();
    try {
        // start transaction
        session.startTransaction();

        const updateBasicData = await Course.findByIdAndUpdate(
            courseId,
            remainingData,
            {
                new: true,
                runValidators: true,
                session,
            }
        );

        // catch error
        if (!updateBasicData) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to update the course'
            );
        }

        if (preRequisiteCourses && preRequisiteCourses.length) {
            // coming from the client
            // make an array of deletedCourseIds
            const deletedPreRequisiteCourses = preRequisiteCourses
                .filter((course) => course.course && course.isDeleted)
                .map((deletedCourse) => deletedCourse.course);

            // remove them from the preRequisiteCourses
            const updateDeletedPreRequisiteCourses =
                await Course.findByIdAndUpdate(
                    courseId,
                    {
                        $pull: {
                            preRequisiteCourses: {
                                course: { $in: deletedPreRequisiteCourses },
                            },
                        },
                    },
                    { session }
                );

            // catch error
            if (!updateDeletedPreRequisiteCourses) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Failed to update the course'
                );
            }
            // add new elements to the preRequisiteCourses that are isDeleted: false
            const newPreRequisiteCourses = preRequisiteCourses.filter(
                (course) => course.course && !course.isDeleted
            );

            const updateNewPreRequisiteCourses = await Course.findByIdAndUpdate(
                courseId,
                {
                    $addToSet: {
                        preRequisiteCourses: { $each: newPreRequisiteCourses },
                    },
                },
                { session }
            );

            // catch error
            if (!updateNewPreRequisiteCourses) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Failed to update the course'
                );
            }
        }

        const result = await Course.findById(courseId).populate(
            'preRequisiteCourses.course'
        );

        // commit transaction
        session.commitTransaction();
        session.endSession();

        return result;
    } catch (err) {
        session.abortTransaction();
        session.endSession();
        throw err;
    }
};

const deleteCourseFromDB = async (courseId: string) => {
    return await Course.findByIdAndUpdate(
        courseId,
        { isDeleted: true },
        { new: true }
    );
};

const assignFacultiesWithCourseIntoDB = async (
    courseId: string,
    faculties: Partial<TCourseFaculty>
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        courseId,
        {
            course: courseId,
            $addToSet: { faculties: { $each: faculties } },
        },
        {
            upsert: true,
            new: true,
        }
    );

    return result;
};

const removeFacultiesFromCourseFromDB = async (
    courseId: string,
    faculties: Partial<TCourseFaculty>
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        courseId,
        {
            $pull: { faculties: { $in: faculties } },
        },
        {
            new: true,
        }
    );

    return result;
};

export const CourseService = {
    insertCourseIntoDB,
    fetchCoursesFromDB,
    fetchCourseByIdFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseFromDB,
};
