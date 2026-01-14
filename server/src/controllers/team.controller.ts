import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { TeamService } from "../services/team.service";

export class TeamController {
	private teamService: TeamService;

	constructor() {
		this.teamService = new TeamService();
	}

	async getAccess(req: Request, res: Response, next: NextFunction) {
		try {
			const matricula = req.user?.matricula;
			if (!matricula) {
				throw new AppError("Acesso negado!", 401);
			}

			const access = await this.teamService.getAccess(String(matricula));
			res.status(200).json(access);
			return;
		} catch (error) {
			next(error);
		}
	}

	async list(req: Request, res: Response, next: NextFunction) {
		try {
			const rows = await this.teamService.listTeamMembers();
			res.status(200).json(rows);
			return;
		} catch (error) {
			next(error);
		}
	}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const created = await this.teamService.createTeamMember(req.body);
			res.status(201).json(created);
			return;
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const updated = await this.teamService.updateTeamMember(String(id), req.body);
			res.status(200).json(updated);
			return;
		} catch (error) {
			next(error);
		}
	}

	async remove(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const result = await this.teamService.removeTeamMember(String(id));
			res.status(200).json(result);
			return;
		} catch (error) {
			next(error);
		}
	}
}
