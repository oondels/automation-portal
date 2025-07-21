import Joi from "joi"

export const estimatedTimeSchema = Joi.object({
  estimatedDurationTime: Joi.string()
    .required()
});