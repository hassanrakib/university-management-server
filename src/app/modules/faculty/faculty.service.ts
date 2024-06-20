import TFaculty from './faculty.interface';
import { Faculty } from './faculty.model';

const fetchFacultiesFromDB = async () => {
    return await Faculty.find();
};

const fetchFacultyByIdFromDB = async (facultyId: string) => {
    return await Faculty.findOne({ id: facultyId });
};

const updateFacultyByIdInDB = async (
    facultyId: string,
    facultyDocPart: Partial<TFaculty>
) => {
    return await Faculty.updateOne({ id: facultyId }, facultyDocPart);
};

export const FacultyService = {
    fetchFacultiesFromDB,
    fetchFacultyByIdFromDB,
    updateFacultyByIdInDB,
};
