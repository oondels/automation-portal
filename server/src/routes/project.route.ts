import Router, { Request, Response } from "express"
import { ProjectController } from "../controllers/project.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CheckPermission } from "../middlewares/checkPermission.middleware";
import { RequireActiveApprover } from "../middlewares/approverPermission.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { projectValidationSchema } from "../dtos/approve-project.dto";
import { estimatedTimeSchema } from "../dtos/estimated-time.dto";
import { createProjectSchema } from "../dtos/create-project.dto";

import { ApproverService } from "../services/approvers.service";

export const projectRoute = Router();
const projectController = new ProjectController();

// GET /projects - List projects with pagination and filters
projectRoute.get("/", AuthMiddleware, projectController.listProjects.bind(projectController));

projectRoute.post("/", AuthMiddleware, validateRequest(createProjectSchema), projectController.newProject.bind(projectController));

projectRoute.get("/test/approve", AuthMiddleware, RequireActiveApprover, projectController.testRolePermission.bind(projectController))

const approverService = new ApproverService()
projectRoute.get("/test/approve2", async (req: Request, res: Response) => {
  try {
    const emails = await approverService.getApproversEmails()

    res.status(200).json(emails)
    return
  } catch (error) {
    console.error("Error desconhecido");
    res.status(500).send("Error")
  }
})

projectRoute.patch("/:id/approval", AuthMiddleware, RequireActiveApprover,
  validateRequest(projectValidationSchema), projectController.approveProject.bind(projectController));

projectRoute.patch("/:id/estimated-time", AuthMiddleware, CheckPermission("updateEstimatedTime"),
  validateRequest(estimatedTimeSchema), projectController.updateEstimatedTime.bind(projectController));

// AuthMiddleware, CheckPermission("attendProject"),
projectRoute.put("/:id/attend/:service", AuthMiddleware, projectController.attendProject.bind(projectController))

projectRoute.put("/:id/pause/:service", AuthMiddleware, projectController.pauseProject.bind(projectController))

projectRoute.put("/:id/resume/:service", AuthMiddleware, projectController.resumeProject.bind(projectController))

projectRoute.put("/:id/complete/:service", AuthMiddleware, projectController.completeProject.bind(projectController))
