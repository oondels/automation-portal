import Joi from "joi";

export const updateApproverSchema = Joi.object({
  usuario: Joi.string().min(3).max(100).optional().messages({
    'string.min': 'Usuário deve ter no mínimo 3 caracteres',
    'string.max': 'Usuário deve ter no máximo 100 caracteres'
  }),
  unidadeDass: Joi.string().min(2).max(20).optional().messages({
    'string.min': 'Unidade DASS deve ter no mínimo 2 caracteres',
    'string.max': 'Unidade DASS deve ter no máximo 20 caracteres'
  }),
  role: Joi.string().min(3).max(30).optional().messages({
    'string.min': 'Role deve ter no mínimo 3 caracteres',
    'string.max': 'Role deve ter no máximo 30 caracteres'
  }),
  permission: Joi.string().max(30).optional().allow(null).messages({
    'string.max': 'Permission deve ter no máximo 30 caracteres'
  }),
  active: Joi.boolean().optional().messages({
    'boolean.base': 'Active deve ser um valor booleano'
  })
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser fornecido para atualização'
});

export const approverIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'ID do aprovador deve ser um UUID válido',
    'any.required': 'ID do aprovador é obrigatório'
  })
});
