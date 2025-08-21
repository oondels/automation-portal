import 'reflect-metadata'
import { config } from "./env"
import { DataSource } from "typeorm"
import { User } from "../models/User"
import { Team } from "../models/Team"
import { Project } from "../models/Project"
import { ProjectTimeline } from "../models/ProjectTimeline"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.env === 'development', // Keep just in development mode
  logging: false,
  entities: [Project, Team, User, ProjectTimeline],
  subscribers: [],
  migrations: [],
})
