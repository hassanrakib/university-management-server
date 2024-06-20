import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import TCourse from './course.interface';
import { Course } from './course.model';

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

    return result;
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

    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
        courseId,
        remainingData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (preRequisiteCourses && preRequisiteCourses.length) {
        // coming from the client
        // make an array of deletedCourseIds
        const deletedPreRequisiteCourses = preRequisiteCourses
            .filter((course) => course.course && course.isDeleted)
            .map((deletedCourse) => deletedCourse.course);

        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                preRequisiteCourses: {
                    course: { $in: deletedPreRequisiteCourses },
                },
            },
        });

        const newPreRequisiteCourses = preRequisiteCourses.filter(
            (course) => course.course && !course.isDeleted
        );

        console.log(newPreRequisiteCourses);
    }

    return updatedBasicCourseInfo;
};

const deleteCourseFromDB = async (courseId: string) => {
    return await Course.findByIdAndUpdate(
        courseId,
        { isDeleted: true },
        { new: true }
    );
};

export const CourseService = {
    insertCourseIntoDB,
    fetchCoursesFromDB,
    fetchCourseByIdFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
};
