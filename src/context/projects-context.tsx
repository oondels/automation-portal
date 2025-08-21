import { createContext, useContext, useState, useEffect } from "react";
import { Project, ProjectStatus } from "../types";
// import { mockProjects } from "../data/mockData";
import axios from "axios";
import { ip } from "../config/ip";

interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  addProject: (project: Omit<Project, "id">) => Promise<Project>;
  updateProjectStatus: (projectId: string, status: ProjectStatus, userId: string, comment?: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${ip}:9137/api/projects/`)
      .then((response) => {
        setProjects(response.data.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar projetos: ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const addProject = async (projectData: Omit<Project, "id">): Promise<Project> => {
    try {
      const response = await axios.post(`${ip}:9137/api/projects/`, projectData, { withCredentials: true });
      const project = response.data as Project;

      setProjects((prev) => [...prev, project]);
      return project;
    } catch (error) {
      console.error("");
      throw error;
    }
  };

  const updateProjectStatus = (projectId: string, status: ProjectStatus, userId: string, comment?: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          // Update project fields based on status
          const updatedFields: Partial<Project> = { status };

          if (status === "approved") {
            updatedFields.approvedBy = userId;
          } else if (status === "in_progress") {
            updatedFields.startDate = new Date().toISOString().split("T")[0];
          } else if (status === "completed") {
            updatedFields.createdAt = new Date().toISOString().split("T")[0];
          }

          return {
            ...project,
            ...updatedFields,
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
    <ProjectsContext.Provider value={{ projects, isLoading, addProject, updateProjectStatus, getProject }}>
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
