import Joi from "joi"

export const projectValidationSchema = Joi.object({
  status: Joi.string().valid("approved", "rejected").required(),
  urgency: Joi.string().valid("low", "medium", "high").optional(),
})