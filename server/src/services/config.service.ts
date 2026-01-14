import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { AppError } from "../utils/AppError";
import { Project } from "../models/Project";
import { ProjectStatus } from "../types/project";
import { NotificationEmail } from "../models/NotificationEmail";
import { User } from "../models/User";

export type UserStats = {
	requested: number;
	approved: number;
	inProgress: number;
	paused: number;
	completed: number;
	rejected: number;
	total: number;
};

export type NotificationSettings = {
	email: string;
	confirmed: boolean;
	unidadeDass: string;
	authorizedNotificationsApps: string[];
};

export class ConfigService {
	private projectRepository: Repository<Project>;
	private notificationEmailRepository: Repository<NotificationEmail>;
	private userRepository: Repository<User>;

	constructor() {
		this.projectRepository = AppDataSource.getRepository(Project);
		this.notificationEmailRepository = AppDataSource.getRepository(NotificationEmail);
		this.userRepository = AppDataSource.getRepository(User);
	}

	private normalizeAuthorizedApps(value: unknown): string[] {
		if (!value) return [];
		if (Array.isArray(value)) return value.filter(Boolean).map(String);
		return [];
	}

	async getUserStats(matricula: string): Promise<UserStats> {
		try {
			const rows = await this.projectRepository
				.createQueryBuilder("project")
				.select("project.status", "status")
				.addSelect("COUNT(*)", "count")
				.where("project.requested_by = :matricula", { matricula })
				.groupBy("project.status")
				.getRawMany<{ status: ProjectStatus; count: string }>();

			const counts: Record<string, number> = {};
			for (const row of rows) {
				counts[row.status] = Number(row.count) || 0;
			}

			const requested = counts[ProjectStatus.REQUESTED] ?? 0;
			const approved = counts[ProjectStatus.APPROVED] ?? 0;
			const inProgress = counts[ProjectStatus.IN_PROGRESS] ?? 0;
			const paused = counts[ProjectStatus.PAUSED] ?? 0;
			const completed = counts[ProjectStatus.COMPLETED] ?? 0;
			const rejected = counts[ProjectStatus.REJECTED] ?? 0;
			const total = requested + approved + inProgress + paused + completed + rejected;

			return {
				requested,
				approved,
				inProgress,
				paused,
				completed,
				rejected,
				total,
			};
		} catch (error) {
			console.error("Erro ao buscar estatísticas:", error);
			throw new AppError("Erro ao buscar estatísticas.", 500);
		}
	}

	async getNotificationSettings(matricula: string): Promise<NotificationSettings> {
		try {
			const record = await this.notificationEmailRepository.findOne({
				where: { userEmail: { matricula } },
			});

			if (!record) {
				return {
					email: "",
					confirmed: false,
					unidadeDass: "",
					authorizedNotificationsApps: [],
				};
			}

			return {
				email: record.email ?? "",
				confirmed: Boolean(record.confirmed),
				unidadeDass: record.unidadeDass ?? "",
				authorizedNotificationsApps: this.normalizeAuthorizedApps(record.authorizedNotificationsApps),
			};
		} catch (error) {
			console.error("Erro ao buscar configurações de notificação:", error);
			throw new AppError("Erro ao buscar configurações de notificação.", 500);
		}
	}

	async updateEmail(matricula: string, email: string, unidadeDass: string): Promise<{ message: string }> {
		try {
			const user = await this.userRepository.findOne({ where: { matricula } });
			if (!user) {
				throw new AppError("Usuário não encontrado.", 404);
			}

			let record = await this.notificationEmailRepository.findOne({
				where: { userEmail: { matricula } },
			});

			if (!record) {
				record = this.notificationEmailRepository.create({
					userEmail: user,
					email,
					unidadeDass,
					confirmed: false,
					authorizedNotificationsApps: [],
				});
				await this.notificationEmailRepository.save(record);
				return { message: "Email cadastrado com sucesso." };
			}

			const emailChanged = (record.email ?? "").trim().toLowerCase() !== email.trim().toLowerCase();
			record.email = email;
			record.unidadeDass = unidadeDass;
			if (emailChanged) {
				record.confirmed = false;
			}

			await this.notificationEmailRepository.save(record);
			return { message: "Email atualizado com sucesso." };
		} catch (error) {
			if (error instanceof AppError) throw error;
			console.error("Erro ao atualizar email:", error);
			throw new AppError("Erro ao atualizar email.", 500);
		}
	}

	async updateNotificationSettings(
		matricula: string,
		enabled: boolean,
		applications: string[]
	): Promise<{ message: string }> {
		try {
			const record = await this.notificationEmailRepository.findOne({
				where: { userEmail: { matricula } },
			});

			if (!record || !record.email) {
				throw new AppError("Email não cadastrado. Configure o email antes de ativar notificações.", 400);
			}

			if (!enabled) {
				record.authorizedNotificationsApps = [];
				await this.notificationEmailRepository.save(record);
				return { message: "Notificações desativadas com sucesso." };
			}

			const uniqueApps = Array.from(new Set((applications ?? []).filter(Boolean).map(String)));
			record.authorizedNotificationsApps = uniqueApps;
			await this.notificationEmailRepository.save(record);

			return { message: "Configurações de notificação atualizadas com sucesso." };
		} catch (error) {
			if (error instanceof AppError) throw error;
			console.error("Erro ao atualizar configurações de notificação:", error);
			throw new AppError("Erro ao atualizar configurações de notificação.", 500);
		}
	}
}