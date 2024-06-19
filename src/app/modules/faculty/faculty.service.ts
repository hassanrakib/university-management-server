import { Faculty } from './faculty.model';

const fetchFacultiesFromDB = async () => {
    return await Faculty.find();
};

export const FacultyService = {
    fetchFacultiesFromDB,
};
