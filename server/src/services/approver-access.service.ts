import { AppDataSource } from "../config/data-source";
import { Team } from "../models/Team";
import { User } from "../models/User";

function normalize(value: unknown): string {
	return String(value ?? "").trim().toUpperCase();
}

const allowedTeamRoles = new Set(["COORDENADOR", "ADMIN_MASTER", "SENIOR"]);

export async function canManageApproversByMatricula(matricula: string): Promise<boolean> {
	const matriculaStr = String(matricula ?? "").trim();
	if (!matriculaStr) return false;

	const userRepository = AppDataSource.getRepository(User);
	const teamRepository = AppDataSource.getRepository(Team);

	const user = await userRepository.findOne({ where: { matricula: matriculaStr } });
	if (!user) return false;

	const setor = normalize(user.setor);
	if (setor !== "AUTOMACAO") return false;

	const teamRow = await teamRepository.findOne({ where: { registration: matriculaStr } });
	if (!teamRow) return false;

	const role = normalize(teamRow.role);
	return allowedTeamRoles.has(role);
}
