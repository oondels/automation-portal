import { Router } from "express";
import { ApproverController } from "../controllers/approver.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CheckPermission } from "../middlewares/checkPermission.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { createApproverSchema } from "../dtos/create-approver.dto";
import { updateApproverSchema, approverIdParamSchema } from "../dtos/update-approver.dto";

export const approverRoute = Router();
const approverController = new ApproverController();

// GET /approvers - Listar todos aprovadores (apenas ADMIN)
approverRoute.get(
  "/", 
  AuthMiddleware, 
  CheckPermission("manageApprovers"),
  approverController.listApprovers.bind(approverController)
);

// GET /approvers/:id - Buscar aprovador específico (apenas ADMIN)
approverRoute.get(
  "/:id", 
  AuthMiddleware, 
  CheckPermission("manageApprovers"),
  approverController.getApprover.bind(approverController)
);

// POST /approvers - Criar novo aprovador (apenas ADMIN)
approverRoute.post(
  "/", 
  AuthMiddleware, 
  CheckPermission("manageApprovers"),
  validateRequest(createApproverSchema),
  approverController.addApprover.bind(approverController)
);

// PATCH /approvers/:id - Atualizar aprovador (apenas ADMIN)
approverRoute.patch(
  "/:id", 
  AuthMiddleware, 
  CheckPermission("manageApprovers"),
  validateRequest(updateApproverSchema),
  approverController.editApprover.bind(approverController)
);

// DELETE /approvers/:id - Desativar aprovador (soft delete, apenas ADMIN)
approverRoute.delete(
  "/:id", 
  AuthMiddleware, 
  CheckPermission("manageApprovers"),
  approverController.deleteApprover.bind(approverController)
);

// PATCH /approvers/:id/toggle - Ativar/Desativar aprovador (apenas ADMIN)
approverRoute.patch(
  "/:id/toggle", 
  AuthMiddleware, 
  CheckPermission("manageApprovers"),
  approverController.toggleApproverStatus.bind(approverController)
);
