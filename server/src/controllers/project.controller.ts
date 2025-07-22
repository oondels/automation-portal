import { ProjectService } from "../services/project.service";
import { Request, Response, NextFunction } from "express";
import { CreateProjectDTO } from "../types/project";
import { AppError } from "../utils/AppError";
import { User } from "models/User";

export class ProjectController {
  private projectService: ProjectService;
  private allowedServices: string[];

  constructor() {
    this.projectService = new ProjectService();
    this.allowedServices = ["automation", "carpentry", "metalwork"]
  }

  checkService(service: string): void {
    if (!this.allowedServices.includes(service)) {
      throw new AppError("Service type not allowed!", 400)
    }
  }

  // TODO: Add notification system to notify users when a project is created
  async newProject(req: Request, res: Response, next: NextFunction) {
    const projectData: CreateProjectDTO = req.body;

    try {
      const project = await this.projectService.createProject(projectData);

      res.status(201).json({
        message: "Project created successfully",
        data: {
          id: project.id,
          name: project.projectName,
          description: project.description,
          status: project.status,
          urgency: project.urgency,
          type: project.projectType,
          startDate: project.startDate,
        }
      });
      return
    } catch (error) {
      next(error);
    }
  }

  async approveProject(req: Request, res: Response, next: NextFunction) {
    const projectId = req.params.id;
    const username = req.user?.usuario as string
    const { status, urgency } = req.body;

    try {
      const project = await this.projectService.approveProject(projectId, username, status, urgency);

      res.status(200).json({
        message: `Project approved successfully`,
        data: {
          status: project.status,
        }
      });
      return
    } catch (error) {
      next(error);
    }
  }

  async updateEstimatedTime(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.id;
      const { estimatedDurationTime } = req.body

      await this.projectService.updateEstimatedTime(projectId, estimatedDurationTime);

      res.status(200).json({
        message: `Project estimated time updated successfully`,
      });
      return
    } catch (error) {
      next(error);
    }
  }

  async attendProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, service } = req.params
      const registration = req.user?.matricula as number

      this.checkService(service)
      const project = await this.projectService.attend(id, registration, service)

      res.status(200).json({
        message: "Project status updated successfully.",
        data: {
          status: project.status,
          start: project.startDate,
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async pauseProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, service } = req.params
      const user = req.user as User
      const { reason } = req.body

      this.checkService(service)
      const project = await this.projectService.pause(id, user, service, reason)

      res.status(200).json({ message: "Project paused successfully." })
      return
    } catch (error) {
      next(error)
    }
  }
}
