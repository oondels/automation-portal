import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Approver } from "../models/Approvers";

function normalize(value: unknown): string {
	return String(value ?? "").trim().toUpperCase();
}

const manageApproversRoles = new Set(["ADMIN", "ADMIN_MASTER", "COORDENADOR", "SENIOR"]);

export class ApproverPolicyService {
	private approverRepository: Repository<Approver>;

	constructor() {
		this.approverRepository = AppDataSource.getRepository(Approver);
	}

	async getActiveApproverByMatricula(matricula: string): Promise<Approver | null> {
		const matriculaStr = String(matricula ?? "").trim();
		if (!matriculaStr) return null;

		return this.approverRepository.findOne({
			where: { matricula: matriculaStr as any, active: true },
		});
	}

	async isActiveApproverByMatricula(matricula: string): Promise<boolean> {
		const approver = await this.getActiveApproverByMatricula(matricula);
		return !!approver;
	}

	async canApproveProjectsByMatricula(matricula: string): Promise<boolean> {
		// Regra definida: apenas quem está na tabela automacao.approvers (active=true)
		return this.isActiveApproverByMatricula(matricula);
	}

	async canManageApproversByMatricula(matricula: string): Promise<boolean> {
		const approver = await this.getActiveApproverByMatricula(matricula);
		if (!approver) return false;

		// 1) role em uma whitelist
		// 2) permission declarativa (ex.: "manageApprovers")
		const role = normalize(approver.role);
		if (manageApproversRoles.has(role)) return true;

		const permission = String(approver.permission ?? "").trim().toLowerCase();
		return permission === "manageapprovers" || permission === "manage_approvers" || permission === "manage-approvers";
	}
}
