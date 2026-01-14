import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { ConfigService } from "../services/config.service";

export class ConfigController {
	private configService: ConfigService;

	constructor() {
		this.configService = new ConfigService();
	}

	async getUserStats(req: Request, res: Response, next: NextFunction) {
		try {
			const matricula = req.user?.matricula;
			if (!matricula) {
				throw new AppError("Acesso negado!", 401);
			}

			const stats = await this.configService.getUserStats(String(matricula));
			res.status(200).json(stats);
			return;
		} catch (error) {
			next(error);
		}
	}

	async getNotificationSettings(req: Request, res: Response, next: NextFunction) {
		try {
			const matricula = req.user?.matricula;
			if (!matricula) {
				throw new AppError("Acesso negado!", 401);
			}

			const settings = await this.configService.getNotificationSettings(String(matricula));
			res.status(200).json(settings);
			return;
		} catch (error) {
			next(error);
		}
	}

	async updateEmail(req: Request, res: Response, next: NextFunction) {
		try {
			const matricula = req.user?.matricula;
			if (!matricula) {
				throw new AppError("Acesso negado!", 401);
			}

			const { email, unidadeDass } = req.body;
			const result = await this.configService.updateEmail(String(matricula), email, unidadeDass);
			res.status(200).json(result);
			return;
		} catch (error) {
			next(error);
		}
	}

	async updateNotificationSettings(req: Request, res: Response, next: NextFunction) {
		try {
			const matricula = req.user?.matricula;
			if (!matricula) {
				throw new AppError("Acesso negado!", 401);
			}

			const { enabled, applications } = req.body;
			const result = await this.configService.updateNotificationSettings(
				String(matricula),
				Boolean(enabled),
				applications
			);
			res.status(200).json(result);
			return;
		} catch (error) {
			next(error);
		}
	}
}