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
	rfid: digitsOnly.required().messages({
		"string.empty": "RFID é obrigatório",
		"any.required": "RFID é obrigatório",
	}),
	barcode: digitsOnly.required().messages({
		"string.empty": "Código de barras é obrigatório",
		"any.required": "Código de barras é obrigatório",
	}),
	name: Joi.string().min(2).max(200).required().messages({
		"string.empty": "Nome é obrigatório",
		"string.min": "Nome deve ter no mínimo 2 caracteres",
		"string.max": "Nome deve ter no máximo 200 caracteres",
		"any.required": "Nome é obrigatório",
	}),
	username: Joi.string().min(2).max(50).required().messages({
		"string.empty": "Usuário é obrigatório",
		"string.min": "Usuário deve ter no mínimo 2 caracteres",
		"string.max": "Usuário deve ter no máximo 50 caracteres",
		"any.required": "Usuário é obrigatório",
	}),
	unidadeDass: Joi.string().min(2).max(50).optional().default("SEST"),
	role: Joi.string().min(2).max(50).optional().default("intern"),
	level: Joi.string().min(1).max(10).optional().default("C"),
});
