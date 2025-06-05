import joi from "joi";
import { isValidCitizenId } from "../utils/helper.js";

const registerValidation = joi.object({
  first_name: joi.string().required().messages({
    'any.required': 'First name required.',
    'string.empty': 'First name required.'
  }),
  last_name: joi.string().optional().allow(null, ''),
  email: joi.string().email().required().messages({
    'any.required': 'Email required.',
    'string.email': "Email's format not valid.",
    'string.empty': 'Email required.'
  }),
  password: joi.string().min(6).required().messages({
    'any.required': 'Password required.',
    'string.min': 'Password must be at least 6 characters.',
    'string.empty': 'Password required.'
  }),
  phone: joi.string().optional().allow(null, ''),
  citizen_id: joi.string()
    .required()
    .custom((value, helpers) => {
      if (!isValidCitizenId(value)) {
        return helpers.error('any.invalid');
      }
      return value; // trả về giá trị hợp lệ
    }, 'Citizen ID validation')
    .messages({
      'any.required': 'Citizen ID required.',
      'any.invalid': 'Citizen ID is not valid. It must be 12 digits and start with a valid province code.'
    }),
  tax_id: joi.string().required().messages({
    'any.required': 'Tax ID required.',
    'string.empty': 'Tax ID required.'
  }),
  birthday: joi.date().iso().optional().allow(null, ''),
  address: joi.string().optional().allow(null, '')
});

const loginValidation = joi.object({
  email: joi.string().email().required().messages({
    'any.required': 'Email required.',
    'string.email': "Email's format not valid.",
    'string.empty': 'Email required.'
  }),
  password: joi.string().min(6).required().messages({
    'any.required': 'Password required.',
    'string.min': 'Password must be at least 6 characters.',
    'string.empty': 'Password required.'
  }),
});

export { registerValidation, loginValidation };
