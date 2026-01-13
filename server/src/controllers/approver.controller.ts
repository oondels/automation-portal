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
      const payload = req.body as ApproversData;

      const newApprover = await this.approveService.create(payload)

      res.status(201).json({
        message: "Novo aprovador de chamados adicionado com sucesso.",
        newApprover
      })
      return;
    } catch (error) {
      next(error);
    }
  }

  async editApprover(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params;
    } catch (error) {
      next(error);
    }
  }
}