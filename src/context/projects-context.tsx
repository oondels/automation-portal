import { createContext, useContext, useState } from "react";
import { Project, ProjectStatus, TimelineEvent, LogEntry } from "../types";
import { mockProjects } from "../data/mockData";

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "timeline" | "logs">) => Project;
  updateProjectStatus: (
    projectId: string,
    status: ProjectStatus,
    userId: string,
    comment?: string
  ) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const addProject = (
    projectData: Omit<Project, "id" | "timeline" | "logs">
  ): Project => {
    const newProject: Project = {
      ...projectData,
      id: `${projects.length + 1}`,
      timeline: [
        {
          id: `t${Date.now()}`,
          projectId: `${projects.length + 1}`,
          type: "request",
          date: new Date().toISOString().split("T")[0],
          userId: projectData.requestedBy,
        },
      ],
      logs: [
        {
          id: `l${Date.now()}`,
          projectId: `${projects.length + 1}`,
          action: "Project requested",
          timestamp: new Date().toISOString(),
          userId: projectData.requestedBy,
        },
      ],
    };

    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateProjectStatus = (
    projectId: string,
    status: ProjectStatus,
    userId: string,
    comment?: string
  ) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          // Determine timeline event type based on status
          let eventType: TimelineEvent["type"];
          let actionText: string;

          switch (status) {
            case "approved":
              eventType = "approval";
              actionText = "Projeto Aprovado";
              break;
            case "in_progress":
              eventType = "start";
              actionText = "Projeto Iniciado";
              break;
            case "paused":
              eventType = "pause";
              actionText = "Projeto Pausado";
              break;
            case "completed":
              eventType = "completion";
              actionText = "Projeto Concluído";
              break;
            case "rejected":
              eventType = "rejection";
              actionText = "Projeto Rejeitado";
              break;
            default:
              eventType = "request";
              actionText = "Projeto status atualizado";
          }

          // Create new timeline event
          const newTimelineEvent: TimelineEvent = {
            id: `t${Date.now()}`,
            projectId,
            type: eventType,
            date: new Date().toISOString().split("T")[0],
            userId,
            comment,
          };

          // Create new log entry
          const newLogEntry: LogEntry = {
            id: `l${Date.now()}`,
            projectId,
            action: actionText,
            timestamp: new Date().toISOString(),
            userId,
            details: comment,
          };

          // Update project fields based on status
          const updatedFields: Partial<Project> = { status };
          
          if (status === "approved") {
            updatedFields.approvedBy = userId;
          } else if (status === "in_progress") {
            updatedFields.startDate = new Date().toISOString().split("T")[0];
          } else if (status === "completed") {
            updatedFields.endDate = new Date().toISOString().split("T")[0];
          }

          return {
            ...project,
            ...updatedFields,
            timeline: [...project.timeline, newTimelineEvent],
            logs: [...project.logs, newLogEntry],
          };
        }
        return project;
      })
    );
  };

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{ projects, addProject, updateProjectStatus, getProject }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}