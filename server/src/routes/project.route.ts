import Router from "express"
import { ProjectController } from "../controllers/project.controller";

export const projectRoute = Router();
const projectController = new ProjectController();

// Create a new project
projectRoute.post("/", projectController.newProject.bind(projectController));