import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { canManageApproversByMatricula } from "../services/approver-access.service";

export async function ApproverAdminMiddleware(req: Request, _res: Response, next: NextFunction) {
	try {
		const matricula = req.user?.matricula;
		if (!matricula) {
			throw new AppError("Acesso negado!", 401);
		}

		const canManage = await canManageApproversByMatricula(String(matricula));
		if (!canManage) {
			throw new AppError("Acesso negado!", 403);
		}

		next();
	} catch (error) {
		next(error);
	}
}
