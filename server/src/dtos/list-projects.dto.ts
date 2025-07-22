import Joi from "joi"

export const listProjectsQuerySchema = Joi.object({
  status: Joi.string().valid("requested", "approved", "in_progress", "paused", "completed", "rejected").optional(),
  urgency: Joi.string().valid("low", "medium", "high").optional(),
  sector: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().pattern(/^(createdAt|updatedAt):(asc|desc)$/).default("createdAt:desc")
})

export interface ListProjectsQuery {
  status?: string;
  urgency?: string;
  sector?: string;
  page: number;
  limit: number;
  sort: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
