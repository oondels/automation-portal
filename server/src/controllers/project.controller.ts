import { ProjectService } from "../services/project.service";
import { Request, Response, NextFunction } from "express";      
import { CreateProjectDTO } from "../types/project";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
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
}
