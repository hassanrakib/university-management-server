import { FilterQuery, Query } from 'mongoose';

export default class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableFields: string[]) {
        const searchTerm = this.query.searchTerm || '';
        this.modelQuery = this.modelQuery.find({
            $or: searchableFields.map(
                (field) =>
                    ({
                        [field]: {
                            $regex: searchTerm,
                            $options: 'i',
                        },
                    }) as FilterQuery<T>
            ),
        });

        return this;
    }

    filter() {
        const filter = { ...this.query };
        const excludedFields = [
            'searchTerm',
            'sort',
            'limit',
            'page',
            'fields',
        ];
        excludedFields.forEach((field) => delete filter[field]);

        this.modelQuery = this.modelQuery.find(filter as FilterQuery<T>);
        // .populate('admissionSemester')
        // .populate('academicDepartment');

        return this;
    }

    sort() {
        const sort: string =
            (this.query.sort as string)?.split(',').join(' ') || '-createdAt';

        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    paginate() {
        const page = Number(this.query.page as string) || 1;
        const limit = Number(this.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // limit
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);

        return this;
    }

    fields() {
        const fields =
            (this.query.fields as string)?.split(',').join(' ') || '';

        this.modelQuery = this.modelQuery.select(fields);

        return this;
    }

    async countTotal() {
        const totalQueries = this.modelQuery.getFilter();
        const totalDocuments = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Number(this.query.page as string) || 1;
        const limit = Number(this.query.limit as string) || 10;
        const totalPage = Math.ceil(totalDocuments / limit);
        return {
            totalDocuments, page, limit, totalPage
        }
    }
}
