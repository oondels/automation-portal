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

  async getApprovers(): Promise<ApproversData[] | null> {
    try {
      const approvers = await this.approverRepository.find()

      return approvers;
    } catch (error) {
      throw new AppError("Erro inesperado ao buscar aprovadores do sistema de automação.", 500)
    }
  }
}