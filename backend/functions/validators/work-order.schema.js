import Joi from 'joi';

const createWorkOrderSchema = Joi.object({
    customer: Joi.object({
        id: Joi.string().required().messages({
            'any.required': 'The customer ID is required.',
            'string.empty': 'The customer ID cannot be empty.'
        }),
        companyName: Joi.string().trim().min(1).max(100).required().messages({
            'any.required': 'Company Name is required.',
            'string.empty': 'Company Name cannot be empty.',
            'string.min': 'Company Name must have at least {#limit} characters.',
            'string.max': 'Company Name cannot exceed {#limit} characters.'
        }),
        companyPhone: Joi.string().trim().min(5).max(20).required().messages({
            'any.required': 'Company Phone is required.',
            'string.empty': 'Company Phone cannot be empty.',
            'string.min': 'Company Phone must have at least {#limit} characters.',
            'string.max': 'Company Phone cannot exceed {#limit} characters.'
        }),
        companyAddress: Joi.object({
            street: Joi.string().trim().min(1).max(255).required().messages({
                'any.required': 'Street is required.',
                'string.empty': 'Street cannot be empty.'
            }),
            city: Joi.string().trim().min(1).max(100).required().messages({
                'any.required': 'City is required.',
                'string.empty': 'City cannot be empty.'
            }),
            state: Joi.string().trim().min(1).max(100).required().messages({
                'any.required': 'State is required.',
                'string.empty': 'State cannot be empty.'
            }),
            zip: Joi.string().trim().min(3).max(10).required().messages({
                'any.required': 'Zip Code is required.',
                'string.empty': 'Zip Code cannot be empty.'
            }),
        }).required().messages({
            'any.required': 'Company Address is required.'
        }),
        contactName: Joi.string().trim().min(1).max(100).required().messages({
            'any.required': 'Contact Name is required.',
            'string.empty': 'Contact Name cannot be empty.',
            'string.min': 'Contact Name must have at least {#limit} characters.',
            'string.max': 'Contact Name cannot exceed {#limit} characters.'
        }),
        contactPhone: Joi.string().trim().min(5).max(20).messages({
            'string.empty': 'Contact Phone cannot be empty.',
            'string.min': 'Contact Phone must have at least {#limit} characters.',
            'string.max': 'Contact Phone cannot exceed {#limit} characters.'
        }),
    }).required().messages({
        'any.required': 'Customer information is required.'
    }),

    startDate: Joi.date().iso().required().messages({
        'any.required': 'Start date is required.',
        'date.iso': 'Start date must be in ISO 8601 format (e.g., YYYY-MM-DD).'
    }),
    closeDate: Joi.date().iso().allow(null).messages({
        'date.iso': 'Close date must be in ISO 8601 format (e.g., YYYY-MM-DD).'
    }),
    notedEquipments: Joi.array().items(Joi.object()).allow(null),
    servicesPerformed: Joi.array().items(Joi.object()).min(1).required().messages({
        'array.min': 'At least one service must be performed.',
        'any.required': 'Services performed is a required field.'
    }),
    materialsUsed: Joi.array().items(Joi.object()).allow(null),
    type: Joi.string().valid('work', 'pickup').required().messages({
        'any.required': 'Type is required.',
        'string.valid': 'Type must be either "work" or "pickup".'
    }),
});

export default createWorkOrderSchema;