import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { Team } from "../models/Team";
import { Repository } from "typeorm";
import { AppError } from "../utils/AppError";
import { CreateProjectDTO } from "../types/project";
import { ProjectStatus } from "../types/project";
import { ProjectUrgency } from "../types/project";

export class ProjectService {
  private projectRepository: Repository<Project>
  private userRepository: Repository<User>
  private teamRepository: Repository<Team>

  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project)
    this.userRepository = AppDataSource.getRepository(User)
    this.teamRepository = AppDataSource.getRepository(Team)
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id: id } })
    if (!project) {
      throw new AppError("Project not found.", 404)
    }

    return project
  }

  // TODO: Create a integration with IA to auto gen tags for the project
  async createProject(projectData: CreateProjectDTO): Promise<Project> {
    try {
      const user = await this.userRepository.findOne({ where: { matricula: projectData.requestedBy } });
      if (!user) {
        throw new AppError("User not found", 404);
      }

      const project = this.projectRepository.create({ ...projectData, requestedBy: user });
      await this.projectRepository.save(project);
      return project;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Error creating project:", error);

      throw new AppError("Error creating project", 500);
    }
  }

  // TODO: Notify Automação after request status update
  async approveProject(projectId: string, username: string, newStatus: ProjectStatus, urgency: ProjectUrgency): Promise<Project> {
    const project = await this.getProject(projectId)

    if (project.status !== ProjectStatus.REQUESTED) {
      throw new AppError("Only projects with status 'requested' can be approved", 400);
    }

    project.status = newStatus;
    project.urgency = urgency
    project.approvedBy = username
    project.approvedAt = new Date();

    try {
      await this.projectRepository.save(project)

      return project
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error("Error updating project status:", error);

      throw new AppError("Error updating project status.")
    }
  }

  async updateEstimatedTime(projectId: string, estimatedTime: string): Promise<void> {
    try {
      const project = await this.getProject(projectId)

      project.estimatedDurationTime = estimatedTime
      project.updatedAt = new Date()

      await this.projectRepository.save(project)
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error("Error updating project estimated time:", error);

      throw new AppError("Error updating project estimated time.")
    }
  }

  async attend(projectId: string, userRegistration: number, service: string): Promise<Project> {
    try {
      const project = await this.getProject(projectId)

      if (project.status !== ProjectStatus.APPROVED) throw new AppError("Only projects with status 'approved' can be attended!")
      if (!project.estimatedDurationTime || project.estimatedDurationTime === "00:00:00") throw new AppError("Only projects with defined estimated duration time can be attended!");

      let teammate;
      if (service === "automation") {
        teammate = await this.teamRepository.findOne({ where: { registration: userRegistration } })
        if (!teammate) {
          throw new AppError("Team");
        }

        project.automationTeam = teammate;
      }

      const now = new Date();
      project.status = ProjectStatus.IN_PROGRESS;
      project.startDate = now;
      project.updatedAt = now;
      await this.projectRepository.save(project)

      return project
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Error attending project:", error);

      throw new AppError("Error attending project.");
    }
  }
}