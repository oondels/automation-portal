import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { Team } from "../models/Team";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { AppError } from "../utils/AppError";
import { ProjectStatus, ProjectUrgency, PauseRecord, CreateProjectDTO } from "../types/project";
import { ListProjectsQuery, PaginatedResponse } from "../dtos/list-projects.dto";
import { ProjectTimeline } from "../models/ProjectTimeline";
import { wsBroadcast } from "../websockets/manager";
import { NotificationService } from "./notification.service";
import { NotificationPayload } from "../types/notification";
import { NotificationEmail } from "../models/NotificationEmail";
import { ApproverService } from "./approvers.service";

export class ProjectService {
  private projectRepository: Repository<Project>
  private userRepository: Repository<User>
  private teamRepository: Repository<Team>
  private timelineRepository: Repository<ProjectTimeline>
  private approveService: ApproverService

  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project)
    this.userRepository = AppDataSource.getRepository(User)
    this.teamRepository = AppDataSource.getRepository(Team)
    this.timelineRepository = AppDataSource.getRepository(ProjectTimeline)
    this.approveService = new ApproverService()
  }

  private hasValidEstimatedDuration(estimated?: string): boolean {
    if (!estimated) return false;
    const s = String(estimated).trim().toLowerCase();
    // Common zero representations for Postgres interval/string inputs
    if (s === '0 days' || s === '00:00:00' || s === '0:00:00' || s === '0' || s === 'p0d') return false;
    return true;
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: id },
      relations: ['automationTeam', 'requestedBy']
    })
    if (!project) {
      throw new AppError("Project not found.", 404)
    }

    return project
  }

  private async appendTimeline(options: {
    project: Project,
    userRegistration: string,
    eventType: string,
    description: string,
    oldStatus: string | null,
    newStatus: string,
    payload?: Record<string, unknown>
  }): Promise<void> {
    const { project, userRegistration, eventType, description, oldStatus, newStatus, payload } = options
    const user = await this.userRepository.findOne({ where: { matricula: userRegistration } })
    if (!user) return

    const entry = this.timelineRepository.create({
      project,
      user,
      eventType,
      eventDescription: description,
      oldStatus: oldStatus ?? undefined,
      newStatus,
      payload: payload ?? {},
    })
    const saved = await this.timelineRepository.save(entry)
    // Broadcast WS event
    wsBroadcast({
      type: 'project.timeline',
      data: {
        id: saved.id,
        projectId: project.id,
        user: { matricula: user.matricula, usuario: user.usuario, nome: user.nome },
        eventType: saved.eventType,
        eventDescription: saved.eventDescription,
        oldStatus: saved.oldStatus,
        newStatus: saved.newStatus,
        payload: saved.payload,
        createdAt: saved.createdAt,
      }
    })
  }

  async listProjects(queryParams: ListProjectsQuery, role: string, user: User): Promise<PaginatedResponse<Project>> {
    try {
      const { status, urgency, sector, page, limit, sort } = queryParams;

      // Parse sort parameter
      const [sortField, sortDirection] = sort.split(':');
      const orderBy: Record<string, 'ASC' | 'DESC'> = {};
      orderBy[sortField] = sortDirection.toUpperCase() as 'ASC' | 'DESC';

      const where: FindOptionsWhere<Project> = {};
      if (status) where.status = status as ProjectStatus;
      if (urgency) where.urgency = urgency as ProjectUrgency;
      if (sector) where.sector = sector;

      if (role === 'automation') {
        where.status = In([ProjectStatus.APPROVED, ProjectStatus.IN_PROGRESS, ProjectStatus.PAUSED]);
      }
      else if (role === 'user') {
        // Users can see only their requested projects
        where.status = In([ProjectStatus.APPROVED, ProjectStatus.REQUESTED, ProjectStatus.COMPLETED, ProjectStatus.IN_PROGRESS, ProjectStatus.PAUSED]);
        where.requestedBy = { id: user.id };
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      // Execute query with count
      const [projects, total] = await this.projectRepository.findAndCount({
        where,
        relations: ['automationTeam', 'requestedBy', 'timeline'],
        order: orderBy,
        // skip,
        // take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: projects,
        meta: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      console.error("Error listing projects:", error);
      throw new AppError("Erro ao listar projetos.", 500);
    }
  }

  // TODO: Create a integration with IA to auto gen tags for the project
  // TODO: Notificar email
  async createProject(projectData: CreateProjectDTO): Promise<Project> {
    try {
      const user = await this.userRepository.findOne({ where: { matricula: projectData.requestedBy } });
      if (!user) {
        throw new AppError("Usuário não encontrado.", 404);
      }

      const project = this.projectRepository.create({ ...projectData, requestedBy: user });
      await this.projectRepository.save(project);
      // timeline: created
      await this.appendTimeline({
        project,
        userRegistration: user.matricula,
        eventType: 'solicitado',
        description: `Projeto solicitado por ${user.usuario ?? user.nome ?? user.matricula}`,
        oldStatus: null,
        newStatus: project.status,
        payload: { projectName: project.projectName, sector: project.sector }
      })

      const emails = await this.approveService.getApproversEmails()
      if (emails.length > 0) {
        const notificationPayload = {
          to: [],
          subject: "",
          title: "",
          message: "",
          application: ""
        } as NotificationPayload
        await NotificationService.sendNotification(notificationPayload)
      }

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
      throw new AppError("Apenas projetos com status 'solicitado' podem ser aprovados", 400);
    }

    const oldStatus = project.status
    project.status = newStatus;
    project.urgency = urgency
    project.approvedBy = username
    project.approvedAt = new Date();

    try {
      await this.projectRepository.save(project)
      // find approver by username to get registration
      const approver = await this.userRepository.findOne({ where: { usuario: username } })
      if (approver) {
        await this.appendTimeline({
          project,
          userRegistration: approver.matricula,
          eventType: 'aprovado',
          description: `Projeto ${newStatus} por ${username} (urgência: ${urgency})`,
          oldStatus,
          newStatus,
          payload: { urgency }
        })
      }

      return project
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error("Error updating project status:", error);

      throw new AppError("Error updating project status.")
    }
  }

  async updateEstimatedTime(projectId: string, estimatedTime: string, userRegistration?: string): Promise<void> {
    try {
      const project = await this.getProject(projectId)

      project.estimatedDurationTime = estimatedTime
      project.updatedAt = new Date()

      await this.projectRepository.save(project)
      if (userRegistration) {
        await this.appendTimeline({
          project,
          userRegistration,
          eventType: 'tempo_estimado_atualizado',
          description: `Tempo estimado atualizado para ${estimatedTime}`,
          oldStatus: project.status,
          newStatus: project.status,
          payload: { estimatedDurationTime: estimatedTime }
        })
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error("Error updating project estimated time:", error);

      throw new AppError("Error updating project estimated time.")
    }
  }

  async attend(projectId: string, userRegistration: string, service: string): Promise<Project> {
    try {
      const project = await this.getProject(projectId)

      if (project.status !== ProjectStatus.APPROVED) throw new AppError("Only projects with status 'approved' can be attended!")
      if (!this.hasValidEstimatedDuration(project.estimatedDurationTime)) throw new AppError("Only projects with defined estimated duration time can be attended!");

      let teammate;
      if (service === "automation") {
        teammate = await this.teamRepository.findOne({ where: { registration: userRegistration } })
        if (!teammate) {
          throw new AppError("Team");
        }

        project.automationTeam = teammate;
      }

      const now = new Date();
      const oldStatus = project.status
      project.status = ProjectStatus.IN_PROGRESS;
      project.startDate = now;
      project.updatedAt = now;
      await this.projectRepository.save(project)

      await this.appendTimeline({
        project,
        userRegistration,
        eventType: 'atendido',
        description: `Projeto atendido por ${userRegistration} (${service})`,
        oldStatus,
        newStatus: project.status,
        payload: { service }
      })

      return project
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Error attending project:", error);

      throw new AppError("Error attending project.");
    }
  }

  async pause(projectId: string, user: User, service: string, reason: string) {
    try {
      const project = await this.getProject(projectId)

      if (project.status !== ProjectStatus.IN_PROGRESS) throw new AppError("Only projects with status 'in_progress' can be paused!")
      if (Number(user.matricula) !== Number(project.automationTeam?.registration)) {
        throw new AppError("Only the user attending the request can pause it.", 401)
      }

      project.recordedPauses = project.recordedPauses ?? [];
      // TODO: Fix the timestamp calculation
      const now = new Date()
      const pause: PauseRecord = {
        start: now,
        reason: reason,
        user: user.usuario
      }
      const oldStatus = project.status
      project.updatedAt = now
      project.status = ProjectStatus.PAUSED
      project.recordedPauses.push(pause)

      await this.projectRepository.save(project)
      await this.appendTimeline({
        project,
        userRegistration: user.matricula,
        eventType: 'pausado',
        description: `Projeto pausado por ${user.usuario} - motivo: ${reason}`,
        oldStatus,
        newStatus: project.status,
        payload: { service, reason }
      })
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Error pausing project:", error);

      throw new AppError("Error pausing project.");
    }
  }

  async resume(projectId: string, user: User, service: string): Promise<Project> {
    try {
      const project = await this.getProject(projectId)

      if (project.status !== ProjectStatus.PAUSED) throw new AppError("Only projects with status 'paused' can be resumed!")
      if (Number(user.matricula) !== Number(project.automationTeam?.registration)) {
        throw new AppError("Only the user attending the request can resume it.", 401)
      }

      project.recordedPauses = project.recordedPauses ?? [];

      // Find the last pause record and add the end timestamp
      if (project.recordedPauses.length > 0) {
        const lastPause = project.recordedPauses[project.recordedPauses.length - 1];
        if (!lastPause.end) {
          lastPause.end = new Date();
        }
      }

      const now = new Date();
      const oldStatus = project.status
      project.status = ProjectStatus.IN_PROGRESS;
      project.updatedAt = now;

      await this.projectRepository.save(project)

      await this.appendTimeline({
        project,
        userRegistration: user.matricula,
        eventType: 'retomado',
        description: `Projeto retomado por ${user.usuario}`,
        oldStatus,
        newStatus: project.status,
        payload: { service }
      })

      return project
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Error resuming project:", error);

      throw new AppError("Error resuming project.");
    }
  }

  async complete(projectId: string, user: User, service: string): Promise<Project> {
    try {
      const project = await this.getProject(projectId)

      if (project.status !== ProjectStatus.IN_PROGRESS) throw new AppError("Only projects with status 'in_progress' can be completed!")
      if (Number(user.matricula) !== Number(project.automationTeam?.registration)) {
        throw new AppError("Only the user attending the request can complete it.", 401)
      }

      const now = new Date();
      const oldStatus = project.status
      project.status = ProjectStatus.COMPLETED
      project.concludedAt = now
      project.updatedAt = now

      await this.projectRepository.save(project)

      await this.appendTimeline({
        project,
        userRegistration: user.matricula,
        eventType: 'concluido',
        description: `Projeto concluído por ${user.usuario}`,
        oldStatus,
        newStatus: project.status,
        payload: { service }
      })

      return project
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Error completing project:", error);
      throw new AppError("Error completing project.");
    }
  }
}
