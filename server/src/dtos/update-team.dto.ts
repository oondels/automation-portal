import Joi from "joi";

const digitsOnly = Joi.string()
	.pattern(/^\d+$/)
	.messages({
		"string.pattern.base": "Deve conter apenas números",
	});

export const updateTeamSchema = Joi.object({
	name: Joi.string().min(2).max(200).optional(),
	username: Joi.string().min(2).max(50).optional(),
	unidadeDass: Joi.string().min(2).max(50).optional(),
	role: Joi.string().min(2).max(50).optional(),
	level: Joi.string().min(1).max(10).optional(),
	rfid: digitsOnly.optional(),
	barcode: digitsOnly.optional(),
}).min(1);
