import Joi from "joi";

export const createApproverSchema = Joi.object({
  matricula: Joi.string().required().messages({
    'string.empty': 'Matrícula é obrigatória',
    'any.required': 'Matrícula é obrigatória'
  }),
  usuario: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Usuário é obrigatório',
    'string.min': 'Usuário deve ter no mínimo 3 caracteres',
    'string.max': 'Usuário deve ter no máximo 100 caracteres',
    'any.required': 'Usuário é obrigatório'
  }),
  unidadeDass: Joi.string().min(2).max(20).required().messages({
    'string.empty': 'Unidade DASS é obrigatória',
    'string.min': 'Unidade DASS deve ter no mínimo 2 caracteres',
    'string.max': 'Unidade DASS deve ter no máximo 20 caracteres',
    'any.required': 'Unidade DASS é obrigatória'
  }),
  role: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Role é obrigatória',
    'string.min': 'Role deve ter no mínimo 3 caracteres',
    'string.max': 'Role deve ter no máximo 30 caracteres',
    'any.required': 'Role é obrigatória'
  }),
  permission: Joi.string().max(30).optional().allow(null).messages({
    'string.max': 'Permission deve ter no máximo 30 caracteres'
  }),
  active: Joi.boolean().default(true).messages({
    'boolean.base': 'Active deve ser um valor booleano'
  })
});
