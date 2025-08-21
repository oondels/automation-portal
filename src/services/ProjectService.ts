import { api } from "./httpClient";

class ProjectService {
  async getProject(id: string) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }

  async approveProject(id: string, status: string, urgency: string) {
    try {
      const response = await api.patch(`/api/projects/${id}/approval`, {
        status,
        urgency,
      });
      return response.data;
    } catch (error) {
      console.error("Error approving project:", error);
      throw error;
    }
  }

  async setEstimatedDurationTime(id: string, duration: string) {
    try {
      const response = await api.patch(`/api/projects/${id}/estimated-time`, {
        estimatedDurationTime: duration,
      });
      return response.data;
    } catch (error) {
      console.error("Error setting estimated duration time:", error);
      throw error;
    }
  }

  async startProject(id: string, service: string) {
    try {
      const response = await api.put(`/api/projects/${id}/attend/${service}`);
      return response.data;
    } catch (error) {
      console.error("Error starting project:", error);
      throw error;
    }
  }

  async pauseProject(id: string, reason: string, service: string) {
    try {
      const response = await api.put(`/api/projects/${id}/pause/${service}`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error pausing project:", error);
      throw error;
    }
  }

  async resumeProject(id: string, service: string) {
    try {
      const response = await api.put(`/api/projects/${id}/resume/${service}`);
      return response.data;
    } catch (error) {
      console.error("Error resuming project:", error);
      throw error;
    }
  }

  async completeProject(id: string, service: string) {
    try {
      const response = await api.put(`/api/projects/${id}/complete/${service}`);
      return response.data;
    } catch (error) {
      console.error("Error completing project:", error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();
