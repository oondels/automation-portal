import Joi from "joi";

const digitsOnly = Joi.string()
	.pattern(/^\d+$/)
	.messages({
		"string.pattern.base": "Deve conter apenas números",
	});

export const createTeamSchema = Joi.object({
	registration: digitsOnly.required().messages({
		"string.empty": "Matrícula é obrigatória",
		"any.required": "Matrícula é obrigatória",
	}),
});
