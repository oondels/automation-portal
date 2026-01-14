import Joi from "joi";

export const updateEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ser válido',
    'string.empty': 'Email é obrigatório',
    'any.required': 'Email é obrigatório'
  }),
  unidadeDass: Joi.string().min(2).max(10).required().messages({
    'string.empty': 'Unidade DASS é obrigatória',
    'string.min': 'Unidade DASS deve ter no mínimo 2 caracteres',
    'string.max': 'Unidade DASS deve ter no máximo 10 caracteres',
    'any.required': 'Unidade DASS é obrigatória'
  })
});
