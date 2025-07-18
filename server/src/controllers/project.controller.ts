import { ProjectService } from "../services/project.service";
import { Request, Response, NextFunction } from "express";      
import { CreateProjectDTO } from "../types/project";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  // TODO: Make a middleware to validate CreateProjectDTO
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
}
