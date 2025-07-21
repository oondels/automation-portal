import Router from "express"
import { ProjectController } from "../controllers/project.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CheckPermission } from "../middlewares/checkPermission.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { projectValidationSchema } from "../dtos/create-project.dto";
import { estimatedTimeSchema } from "../dtos/estimated-time.dto";

export const projectRoute = Router();
const projectController = new ProjectController();

// TODO: Criar DTO para verificação de dados
projectRoute.post("/", AuthMiddleware, projectController.newProject.bind(projectController));

projectRoute.patch("/:id/approval", AuthMiddleware, CheckPermission("approveProject", "gerente"),
  validateRequest(projectValidationSchema), projectController.approveProject.bind(projectController));


// TODO: Criar DTO para verificação de dados
projectRoute.patch("/:id/estimatedTime", AuthMiddleware, CheckPermission("updateEstimatedTime"),
  validateRequest(estimatedTimeSchema), projectController.updateEstimatedTime.bind(projectController));