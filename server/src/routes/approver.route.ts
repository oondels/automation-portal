import { Router } from "express";
import { ApproverController } from "../controllers/approver.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ApproverAdminMiddleware } from "../middlewares/approverAdmin.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { createApproverSchema } from "../dtos/create-approver.dto";
import { updateApproverSchema, approverIdParamSchema } from "../dtos/update-approver.dto";

export const approverRoute = Router();
const approverController = new ApproverController();

// GET /approvers/access - Checa se o usuário pode gerenciar aprovadores
approverRoute.get(
	"/access",
	AuthMiddleware,
	approverController.getAccess.bind(approverController)
);

// GET /approvers - Listar todos aprovadores
approverRoute.get(
  "/", 
  AuthMiddleware, 
  ApproverAdminMiddleware,
  approverController.listApprovers.bind(approverController)
);

// GET /approvers/:id - Buscar aprovador específico
approverRoute.get(
  "/:id", 
  AuthMiddleware, 
  ApproverAdminMiddleware,
  validateRequest(approverIdParamSchema, "params"),
  approverController.getApprover.bind(approverController)
);

// POST /approvers - Criar novo aprovador
approverRoute.post(
  "/", 
  AuthMiddleware, 
  ApproverAdminMiddleware,
  validateRequest(createApproverSchema),
  approverController.addApprover.bind(approverController)
);

// PATCH /approvers/:id - Atualizar aprovador
approverRoute.patch(
  "/:id", 
  AuthMiddleware, 
  ApproverAdminMiddleware,
  validateRequest(approverIdParamSchema, "params"),
  validateRequest(updateApproverSchema),
  approverController.editApprover.bind(approverController)
);

// DELETE /approvers/:id - Desativar aprovador (soft delete)
approverRoute.delete(
  "/:id", 
  AuthMiddleware, 
  ApproverAdminMiddleware,
  validateRequest(approverIdParamSchema, "params"),
  approverController.deleteApprover.bind(approverController)
);

// PATCH /approvers/:id/toggle - Ativar/Desativar aprovador
approverRoute.patch(
  "/:id/toggle", 
  AuthMiddleware, 
  ApproverAdminMiddleware,
  validateRequest(approverIdParamSchema, "params"),
  approverController.toggleApproverStatus.bind(approverController)
);
