import { NextFunction, Request, Response } from "express";
import { ApproverPolicyService } from "../services/approver-policy.service";
import { AppError } from "../utils/AppError";

const approverPolicy = new ApproverPolicyService();

export async function RequireActiveApprover(req: Request, _res: Response, next: NextFunction) {
	try {
		const matricula = req.user?.matricula;
		if (!matricula) {
			throw new AppError("Acesso negado!", 401);
		}

		const allowed = await approverPolicy.canApproveProjectsByMatricula(String(matricula));
		if (!allowed) {
			throw new AppError("Acesso negado!", 403);
		}

		next();
	} catch (error) {
		next(error);
	}
}
