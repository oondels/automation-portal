import Router from "express"
import { ProjectController } from "../controllers/project.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CheckPermission } from "../middlewares/checkPermission.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { projectValidationSchema } from "../dtos/approve-project.dto";
import { estimatedTimeSchema } from "../dtos/estimated-time.dto";

export const projectRoute = Router();
const projectController = new ProjectController();

// TODO: Criar DTO para verificação de dados
projectRoute.post("/", AuthMiddleware, projectController.newProject.bind(projectController));

projectRoute.patch("/:id/approval", AuthMiddleware, CheckPermission("approveProject", "analista"),
  validateRequest(projectValidationSchema), projectController.approveProject.bind(projectController));

// TODO: Criar DTO para verificação de dados
projectRoute.patch("/:id/estimated-time", AuthMiddleware, CheckPermission("updateEstimatedTime"),
  validateRequest(estimatedTimeSchema), projectController.updateEstimatedTime.bind(projectController));

// TODO: Criar DTO para verificação de dados se necessariostat
// AuthMiddleware, CheckPermission("attendProject"),
projectRoute.put("/:id/attend/:service", projectController.attendProject.bind(projectController))

projectRoute.put("/:id/pause/:service", AuthMiddleware, projectController.pauseProject.bind(projectController))