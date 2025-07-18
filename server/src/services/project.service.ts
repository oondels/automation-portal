import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { Team } from "../models/Team";
import { Repository } from "typeorm";
import { AppError } from "../utils/AppError";
import { CreateProjectDTO } from "../types/project";

export class ProjectService {
  private projectRepository: Repository<Project>
  private userRepository: Repository<User>
  private teamRepository: Repository<Team>

  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project)
    this.userRepository = AppDataSource.getRepository(User)
    this.teamRepository = AppDataSource.getRepository(Team)
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
}