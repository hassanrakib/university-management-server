import Joi from 'joi';
import { TBloodGroup } from './student.interface';

// student schema by joi package

// Custom validation function for firstName
const firstNameValidator = (
    value: string,
    helpers: Joi.CustomHelpers
): string | Joi.ErrorReport => {
    const idealFirstName = value.charAt(0).toUpperCase() + value.slice(1);
    if (value !== idealFirstName) {
        return helpers.error('string.custom', {
            message: `"${value}" is not valid. The first name should start with an uppercase letter.`,
        });
    }
    return value;
};

// Custom validation function for lastName
const lastNameValidator = (value: string, helpers: Joi.CustomHelpers) => {
    if (!/^[A-Za-z]+$/.test(value)) {
        return helpers.error('string.custom', {
            message: `"${value}" is not valid. The last name should contain only alphabetic characters.`,
        });
    }
    return value;
};

const nameSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .required()
        .max(20)
        .custom(firstNameValidator, 'custom firstName validation')
        .messages({
            'any.required': 'name.firstName is required',
            'string.max': 'name.firstName exceeded 20 characters',
        }),
    middleName: Joi.string().allow(''),
    lastName: Joi.string()
        .required()
        .custom(lastNameValidator, 'custom lastName validation')
        .messages({
            'any.required': 'name.lastName is required',
        }),
});

const guardianSchema = Joi.object({
    fatherName: Joi.string().required().messages({
        'any.required': 'guardian.fatherName is required',
    }),
    fatherOccupation: Joi.string().required().messages({
        'any.required': 'guardian.fatherOccupation is required',
    }),
    fatherContactNo: Joi.string().required().messages({
        'any.required': 'guardian.fatherContactNo is required',
    }),
    motherName: Joi.string().required().messages({
        'any.required': 'guardian.motherName is required',
    }),
    motherOccupation: Joi.string().required().messages({
        'any.required': 'guardian.motherOccupation is required',
    }),
    motherContactNo: Joi.string().required().messages({
        'any.required': 'guardian.motherContactNo is required',
    }),
});

const localGuardianSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'localGuardian.name is required',
    }),
    occupation: Joi.string().required().messages({
        'any.required': 'localGuardian.occupation is required',
    }),
    contactNo: Joi.string().required().messages({
        'any.required': 'localGuardian.contactNo is required',
    }),
    address: Joi.string().required().messages({
        'any.required': 'localGuardian.address is required',
    }),
});

const studentValidationSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'student.id is required',
    }),
    name: nameSchema.required().messages({
        'any.required': 'student.name is required',
    }),
    gender: Joi.string().valid('male', 'female').required().messages({
        'any.required': 'student.gender is required',
        'any.only': '{#value} is not supported',
    }),
    dateOfBirth: Joi.string(),
    email: Joi.string().required().email().messages({
        'any.required': 'student.email is required',
        'string.email': '{#value} is not a valid email',
    }),
    contactNo: Joi.string().required().messages({
        'any.required': 'student.contactNo is required',
    }),
    emergencyContactNo: Joi.string().required().messages({
        'any.required': 'student.emergencyContactNo is required',
    }),
    bloodGroup: Joi.string().valid(...Object.values(TBloodGroup)),
    presentAddress: Joi.string().required().messages({
        'any.required': 'student.presentAddress is required',
    }),
    permanentAddress: Joi.string().required().messages({
        'any.required': 'student.permanentAddress is required',
    }),
    guardian: guardianSchema.required().messages({
        'any.required': 'student.guardian is required',
    }),
    localGuardian: localGuardianSchema.required().messages({
        'any.required': 'student.localGuardian is required',
    }),
    profileImg: Joi.string(),
    isActive: Joi.string().valid('active', 'blocked').default('active'),
});

export default studentValidationSchema;
