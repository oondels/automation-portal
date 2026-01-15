import 'reflect-metadata'
import { config } from "./env"
import { DataSource } from "typeorm"
import { User } from "../models/User"
import { Team } from "../models/Team"
import { Project } from "../models/Project"
import { ProjectTimeline } from "../models/ProjectTimeline"
import { NotificationEmail } from '../models/NotificationEmail'
import { Approver } from '../models/Approvers'

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  synchronize: false, // Keep just in development mode
  logging: false,
  entities: [User, Team, Project, ProjectTimeline, NotificationEmail, Approver], // Correção de erro que ao compiçlar mantinha .ts, e ao jogar em produção causava erro
  migrations: [config.env === 'development' ? "src/migrations/*.ts" : "src/migrations/*.js"], // Correção de erro que ao compiçlar mantinha .ts, e ao jogar em produção causava erro
  subscribers: [],
})
