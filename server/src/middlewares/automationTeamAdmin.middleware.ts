import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Team } from "../models/Team";
import { AppError } from "../utils/AppError";

const allowedFunctions = new Set(["ANALISTA", "COORDENADOR", "ADMIN"]);

function normalize(value: unknown): string {
	return String(value ?? "")
		.trim()
		.toUpperCase();
}

export async function AutomationTeamAdminMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	try {
		const matricula = req.user?.matricula;
		if (!matricula) {
			throw new AppError("Acesso negado!", 401);
		}

		const matriculaStr = String(matricula);
		const userRepository = AppDataSource.getRepository(User);
		const teamRepository = AppDataSource.getRepository(Team);

		const user = await userRepository.findOne({ where: { matricula: matriculaStr } });
		if (!user) {
			throw new AppError("Usuário não encontrado.", 404);
		}

		const setor = normalize(user.setor);
		const nivel = normalize(user.nivel);
		const funcao = normalize(user.funcao);

		const allowedByProfile =
			setor === "AUTOMACAO" &&
			nivel === "A" &&
			allowedFunctions.has(funcao);

		if (!allowedByProfile) {
			throw new AppError("Acesso negado!", 403);
		}

		const isMember = await teamRepository.exist({
			where: { registration: matriculaStr },
		});

		if (!isMember) {
			throw new AppError("Acesso negado! Usuário não pertence ao time de automação.", 403);
		}

		next();
	} catch (error) {
		next(error);
	}
}
