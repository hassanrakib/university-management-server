import QueryBuilder from '../../builder/QueryBuilder';
import { FacultySearchableFields } from './faculty.constant';
import TFaculty from './faculty.interface';
import { Faculty } from './faculty.model';

const fetchFacultiesFromDB = async (query: Record<string, unknown>) => {
    const facultyQuery = new QueryBuilder(Faculty.find(), query)
        .search(FacultySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await facultyQuery.modelQuery.populate(
        'academicDepartment',
        'academicFaculty'
    );

    return result;
};

const fetchFacultyByIdFromDB = async (facultyId: string) => {
    return await Faculty.findOne({ id: facultyId })
        .populate('academicDepartment')
        .populate('academicFaculty');
};

const updateFacultyByIdInDB = async (
    facultyId: string,
    facultyDocPart: Partial<TFaculty>
) => {
    const { name, ...remainingData } = facultyDocPart;

    const modifiedFaculty: Record<string, unknown> = {
        ...remainingData,
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedFaculty[`name.${key}`] = value;
        }
    }

    return await Faculty.findOneAndUpdate({ id: facultyId }, modifiedFaculty, {
        new: true,
        runValidators: true,
    });
};

export const FacultyService = {
    fetchFacultiesFromDB,
    fetchFacultyByIdFromDB,
    updateFacultyByIdInDB,
};
