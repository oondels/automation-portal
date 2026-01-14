import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Team } from "../models/Team";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

export type TeamMemberDTO = {
	id: string;
	name: string;
	registration: string;
	rfid: string;
	barcode: string;
	username: string;
	unidadeDass: string;
	role: string;
	level: string;
	createdAt: Date;
	updatedAt: Date;
	user: {
		matricula: string;
		nome: string | null;
		usuario: string | null;
		setor: string | null;
		funcao: string | null;
		nivel: string | null;
		unidade: string | null;
	};
};

export type CreateTeamInput = {
	registration: string;
	rfid: string;
	barcode: string;
	name: string;
	username: string;
	unidadeDass?: string;
	role?: string;
	level?: string;
};

export type UpdateTeamInput = Partial<
	Pick<TeamMemberDTO, "name" | "username" | "unidadeDass" | "role" | "level"> & {
		rfid: string;
		barcode: string;
	}
>;

function safeParseBigIntAsNumber(value: string, fieldLabel: string): number {
	const parsed = Number(value);
	if (!Number.isSafeInteger(parsed)) {
		throw new AppError(`${fieldLabel} inválido.`, 400);
	}
	return parsed;
}

export class TeamService {
	private teamRepository: Repository<Team>;
	private userRepository: Repository<User>;

	constructor() {
		this.teamRepository = AppDataSource.getRepository(Team);
		this.userRepository = AppDataSource.getRepository(User);
	}

	async getAccess(matricula: string): Promise<{ canManage: boolean }> {
		const user = await this.userRepository.findOne({ where: { matricula } });
		if (!user) return { canManage: false };

		const setor = String(user.setor ?? "").trim().toUpperCase();
		const nivel = String(user.nivel ?? "").trim().toUpperCase();
		const funcao = String(user.funcao ?? "").trim().toUpperCase();

		const allowedFunctions = new Set(["ANALISTA", "COORDENADOR", "ADMIN"]);
		const allowedByProfile = setor === "AUTOMACAO" && nivel === "A" && allowedFunctions.has(funcao);
		if (!allowedByProfile) return { canManage: false };

		const isMember = await this.teamRepository.exist({ where: { registration: matricula } });
		return { canManage: Boolean(isMember) };
	}

	private toDTO(entity: Team): TeamMemberDTO {
		return {
			id: entity.id,
			name: entity.name,
			registration: String(entity.registration),
			rfid: String(entity.rfid),
			barcode: String(entity.barcode),
			username: entity.username,
			unidadeDass: entity.unidadeDass,
			role: entity.role,
			level: entity.level,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			user: {
				matricula: String(entity.registrationUser?.matricula ?? entity.registration),
				nome: entity.registrationUser?.nome ?? null,
				usuario: entity.registrationUser?.usuario ?? null,
				setor: entity.registrationUser?.setor ?? null,
				funcao: entity.registrationUser?.funcao ?? null,
				nivel: entity.registrationUser?.nivel ?? null,
				unidade: entity.registrationUser?.unidade ?? null,
			},
		};
	}

	async listTeamMembers(): Promise<TeamMemberDTO[]> {
		const rows = await this.teamRepository.find({
			relations: { registrationUser: true },
			order: { createdAt: "DESC" },
		});
		return rows.map((row) => this.toDTO(row));
	}

	async createTeamMember(input: CreateTeamInput): Promise<TeamMemberDTO> {
		const matricula = String(input.registration);
		const user = await this.userRepository.findOne({ where: { matricula } });
		if (!user) {
			throw new AppError("Usuário não encontrado para a matrícula informada.", 404);
		}

		const alreadyMember = await this.teamRepository.exist({ where: { registration: matricula } });
		if (alreadyMember) {
			throw new AppError("Usuário já está cadastrado na equipe.", 409);
		}

		const rfid = safeParseBigIntAsNumber(String(input.rfid), "RFID");
		const barcode = safeParseBigIntAsNumber(String(input.barcode), "Código de barras");

		const created = this.teamRepository.create({
			name: input.name,
			registration: matricula,
			rfid,
			barcode,
			username: input.username,
			unidadeDass: input.unidadeDass ?? "SEST",
			role: input.role ?? "intern",
			level: input.level ?? "C",
			registrationUser: user,
		});

		const saved = await this.teamRepository.save(created);
		const withUser = await this.teamRepository.findOne({
			where: { id: saved.id },
			relations: { registrationUser: true },
		});
		return this.toDTO(withUser ?? saved);
	}

	async updateTeamMember(id: string, input: UpdateTeamInput): Promise<TeamMemberDTO> {
		const record = await this.teamRepository.findOne({
			where: { id },
			relations: { registrationUser: true },
		});
		if (!record) {
			throw new AppError("Membro não encontrado.", 404);
		}

		if (input.name !== undefined) record.name = input.name;
		if (input.username !== undefined) record.username = input.username;
		if (input.unidadeDass !== undefined) record.unidadeDass = input.unidadeDass;
		if (input.role !== undefined) record.role = input.role;
		if (input.level !== undefined) record.level = input.level;
		if (input.rfid !== undefined) record.rfid = safeParseBigIntAsNumber(String(input.rfid), "RFID");
		if (input.barcode !== undefined) record.barcode = safeParseBigIntAsNumber(String(input.barcode), "Código de barras");

		const saved = await this.teamRepository.save(record);
		return this.toDTO(saved);
	}

	async removeTeamMember(id: string): Promise<{ message: string }> {
		const record = await this.teamRepository.findOne({ where: { id } });
		if (!record) {
			throw new AppError("Membro não encontrado.", 404);
		}

		await this.teamRepository.remove(record);
		return { message: "Membro removido com sucesso." };
	}
}
