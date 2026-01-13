import { Request, Response, NextFunction } from "express";
import { ApproverService, ApproversData } from "../services/approvers.service";
import { AppError } from "../utils/AppError";

export class ApproverController {
  private approveService: ApproverService 

  constructor () {
    this.approveService = new ApproverService();
  }

  async addApprover(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as Omit<ApproversData, "id">;

      const newApprover = await this.approveService.create(payload)

      res.status(201).json({
        message: "Novo aprovador de chamados adicionado com sucesso.",
        data: newApprover
      })
      return;
    } catch (error) {
      next(error);
    }
  }

  async listApprovers(req: Request, res: Response, next: NextFunction) {
    try {
      const approvers = await this.approveService.getApprovers();

      res.status(200).json({
        message: "Aprovadores listados com sucesso",
        data: approvers
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  async getApprover(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const approver = await this.approveService.getApproverById(id);

      res.status(200).json({
        message: "Aprovador encontrado com sucesso",
        data: approver
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  async editApprover(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payload = req.body as Partial<Omit<ApproversData, "id" | "matricula">>;

      const updatedApprover = await this.approveService.updateApprover(id, payload);

      res.status(200).json({
        message: "Aprovador atualizado com sucesso",
        data: updatedApprover
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  async deleteApprover(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.approveService.deleteApprover(id);

      res.status(200).json({
        message: "Aprovador desativado com sucesso"
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  async toggleApproverStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const approver = await this.approveService.toggleApproverStatus(id);

      res.status(200).json({
        message: `Aprovador ${approver.active ? 'ativado' : 'desativado'} com sucesso`,
        data: approver
      });
      return;
    } catch (error) {
      next(error);
    }
  }
}