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
      // Verificar se já existe um aprovador com esta matrícula
      const existingApprover = await this.approverRepository.findOne({
        where: { matricula: payload.matricula }
      });

      if (existingApprover) {
        throw new AppError("Já existe um aprovador com esta matrícula", 409);
      }

      const newApprover = this.approverRepository.create(payload)
      await this.approverRepository.save(newApprover)
      
      return newApprover;
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError("Erro ao adicionar novo aprovador", 500)
    }
  }

  async getApproverById(approverId: string): Promise<Approver | null> {
    try {
      const approver = await this.approverRepository.findOne({
        where: { id: approverId },
        relations: {
          user: {
            email: true
          }
        }
      });

      if (!approver) {
        throw new AppError("Aprovador não encontrado", 404);
      }

      return approver;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao buscar aprovador", 500);
    }
  }

  async updateApprover(approverId: string, payload: Partial<Omit<ApproversData, "id" | "matricula">>): Promise<Approver> {
    try {
      const approver = await this.approverRepository.findOne({
        where: { id: approverId }
      });

      if (!approver) {
        throw new AppError("Aprovador não encontrado", 404);
      }

      // Atualizar apenas os campos fornecidos
      Object.assign(approver, payload);

      await this.approverRepository.save(approver);
      
      return approver;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao editar aprovador", 500);
    }
  }

  async deleteApprover(approverId: string): Promise<void> {
    try {
      const approver = await this.approverRepository.findOne({
        where: { id: approverId }
      });

      if (!approver) {
        throw new AppError("Aprovador não encontrado", 404);
      }

      // Soft delete - apenas desativar
      approver.active = false;
      await this.approverRepository.save(approver);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao deletar aprovador", 500);
    }
  }

  async toggleApproverStatus(approverId: string): Promise<Approver> {
    try {
      const approver = await this.approverRepository.findOne({
        where: { id: approverId }
      });

      if (!approver) {
        throw new AppError("Aprovador não encontrado", 404);
      }

      // Inverter status active
      approver.active = !approver.active;
      await this.approverRepository.save(approver);

      return approver;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao alterar status do aprovador", 500);
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