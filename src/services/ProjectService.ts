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
}

export const projectService = new ProjectService();