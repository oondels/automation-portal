import Joi from "joi";

export const updateNotificationSettingsSchema = Joi.object({
  enabled: Joi.boolean().required().messages({
    'boolean.base': 'Enabled deve ser um valor booleano',
    'any.required': 'Enabled é obrigatório'
  }),
  applications: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Applications deve ser um array',
    'any.required': 'Applications é obrigatório'
  })
});
