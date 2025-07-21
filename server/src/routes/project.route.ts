import Router from "express"
import { ProjectController } from "../controllers/project.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CheckRole } from "../middlewares/checkRole.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { projectValidationSchema } from "../dtos/create-project.dto";

export const projectRoute = Router();
const projectController = new ProjectController();

// TODO: Fazer middleware de verificação DTO
projectRoute.post("/", AuthMiddleware, projectController.newProject.bind(projectController));

// TODO: Mudar role para 'gerente'
projectRoute.patch("/:id/approval", AuthMiddleware, CheckRole("analista"), validateRequest(projectValidationSchema), projectController.approveProject.bind(projectController));