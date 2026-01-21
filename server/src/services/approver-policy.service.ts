import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Approver } from "../models/Approvers";
import { Team } from "../models/Team"
import { TeamService } from "./team.service";

function normalize(value: unknown): string {
  return String(value ?? "").trim().toUpperCase();
}

const manageApproversRoles = new Set(["ADMIN", "ADMIN_MASTER", "COORDENADOR", "SENIOR"]);

export class ApproverPolicyService {
  private approverRepository: Repository<Approver>;
  private teamService: TeamService

  constructor() {
    this.approverRepository = AppDataSource.getRepository(Approver);
    this.teamService = new TeamService()
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

  // Usuarios da equipe de manutencao (Model Team) com role === 'admin_master', 'coordeador' tem acesso
  async canManageApproversByMatricula(matricula: string): Promise<boolean> {
    const member = await this.teamService.getTeamMemberByMatricula(matricula)
    if (!member) return false;

    const role = normalize(member.role);

    if (manageApproversRoles.has(role.toUpperCase())) return true;
    return false
  }
}
