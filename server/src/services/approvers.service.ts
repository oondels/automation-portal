import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Approver } from "../models/Approvers";
import { AppError } from "../utils/AppError";

export interface ApproversData {
  id: string;
  matricula: string;
  usuario: string;
  unidadeDass: string;
  role: string;
  permission?: string | null;
}

export class ApproverService {
  private approverRepository: Repository<Approver>

  constructor() {
    this.approverRepository = AppDataSource.getRepository(Approver)
  }

  async create(payload: Omit<ApproversData, "id">) {
    try {
      const newApprover = this.approverRepository.create(payload)
      await this.approverRepository.save(newApprover)
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Erro ao adicionar novo aprovador", 500)
    }
  }

  async del() { }

  async edit(projectId: string, active: boolean) {
    try {
      const approver = await this.approverRepository.findOne({
        where: {
          id: projectId
        }
      })
      if (!approver) {
        throw new AppError("Usuário aprovador não encontrado.", 404)
      }

    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Erro ao editar novo aprovador", 500)
    }
  }

  async getApprovers(): Promise<ApproversData[] | null> {
    try {
      const approvers = await this.approverRepository.find()

      return approvers;
    } catch (error) {
      throw new AppError("Erro inesperado ao buscar aprovadores do sistema de automação.", 500)
    }
  }

  async getApproversEmails(): Promise<string[]> {
    try {
      const approvers = await this.approverRepository.find({
        relations: {
          user: {
            email: true // Carrega: Approver -> User -> NotificationEmail
          }
        },
        // 2. PERFORMANCE: Seleciona apenas os campos necessários
        select: {
          id: true,
          matricula: true,
          usuario: true,     // Nome do aprovador
          role: true,
          unidadeDass: true,
          user: {
            nome: true,      // Nome completo do cadastro
            email: {
              email: true,   // O endereço de email em si
              confirmed: true,
              authorizedNotificationsApps: true
            }
          }
        },
        order: {
          usuario: 'ASC'
        }
      });

      const emails: string[] = []
      approvers.forEach(approver => {
        if (approver?.user?.email?.confirmed) {
          emails.push(approver?.user?.email?.email)
        }
      })

      return emails;
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      throw new AppError("Erro ao buscar emails dos aprovadores.")
    }
  }
}