import Joi from "joi";
import { ProjectType, ProjectUrgency } from "../types/project";

export const createProjectSchema = Joi.object({
  projectName: Joi.string().min(3).max(255).required(),
  sector: Joi.string().min(2).max(100).required(),
  urgency: Joi.string().valid(
    ProjectUrgency.LOW,
    ProjectUrgency.MEDIUM,
    ProjectUrgency.HIGH
  ).default(ProjectUrgency.LOW),
  projectType: Joi.string().valid(
    ProjectType.APP_DEVELOPMENT,
    ProjectType.PROCESS_AUTOMATION,
    ProjectType.APP_IMPROVEMENT,
    ProjectType.APP_FIX,
    ProjectType.CARPENTRY,
    ProjectType.METALWORK
  ).default(ProjectType.APP_DEVELOPMENT),
  startDate: Joi.date().optional(),
  estimatedDurationTime: Joi.string().optional(),
  description: Joi.string().min(5).required(),
  expectedGains: Joi.array().items(Joi.string()).default([]),
  projectTags: Joi.array().items(Joi.string()).default([]),
  pictures: Joi.array().items(Joi.string()).default([]),
  requestedBy: Joi.number().integer().required(),
});

