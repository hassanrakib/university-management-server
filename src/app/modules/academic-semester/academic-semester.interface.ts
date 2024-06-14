export enum TSemesterMonths {
    January = 'January',
    February = 'February',
    March = 'March',
    April = 'April',
    May = 'May',
    June = 'June',
    July = 'July',
    August = 'August',
    September = 'September',
    October = 'October',
    November = 'November',
    December = 'December',
}

export enum TSemesterNames {
    'Autumn' = 'Autumn',
    'Summer' = 'Summer',
    'Fall' = 'Fall',
}

export enum TSemesterCodes {
    '01' = '01',
    '02' = '02',
    '03' = '03',
}

export interface TAcademicSemester {
    name: TSemesterNames;
    code: TSemesterCodes;
    year: string;
    startMonth: TSemesterMonths;
    endMonth: TSemesterMonths;
}

export type TSemesterNameCodeMapper = {
    [key: string]: string;
};
