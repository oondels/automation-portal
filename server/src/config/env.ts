import path from "path"
import dotenv from "dotenv"
import Joi from "joi"

const development = process.env.NODE_ENV === 'development'
const envfile = development ? ".env" : ".env.prod"
dotenv.config({
  path: path.resolve(__dirname, "../../", envfile)
})

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .required()
    .description('Application environment'),

  PORT: Joi.number()
    .integer()
    .min(1)
    .required()
    .description('Port to bind'),

  DATABASE_HOST: Joi.string()
    .required()
    .description('Database connection host'),

  DATABASE_PORT: Joi.number()
    .integer()
    .required()
    .description('Database connection port'),

  DATABASE_USER: Joi.string()
    .required()
    .description('Database connection user'),

  DATABASE_PASSWORD: Joi.string()
    .required()
    .description('Database connection password'),

  DATABASE_NAME: Joi.string()
    .required()
    .description('Database connection name'),

  JWT_SECRET: Joi.string()
    .required()
    .description("Auth Secret Key"),

  NOTIFICATION_API: Joi.string()
    .required()
    .description("Notification api"),
  NOTIFICATION_API_KEY: Joi.string()
    .required()
    .description("Notification API key"),
  FRONTEND_URL: Joi.string()
    .uri()
    .default("http://localhost:5173")
    .description("Frontend URL for links in notifications")
})
  .unknown()         // allow extra env vars
  .required();

const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  convert: true
})

if (error) {
  console.error('Environment validation error:', error.details.map(d => d.message).join('; '));
  process.exit(1);
}

export const config = {
  env: envVars.NODE_ENV as 'development' | 'production' | 'test',
  port: envVars.PORT as number,
  secret_key: envVars.JWT_SECRET as string,
  database: {
    host: envVars.DATABASE_HOST as string,
    port: envVars.DATABASE_PORT as number,
    user: envVars.DATABASE_USER as string,
    password: envVars.DATABASE_PASSWORD as string,
    name: envVars.DATABASE_NAME as string,
  },
  notification_api: envVars.NOTIFICATION_API,
  notification_api_key: envVars.NOTIFICATION_API_KEY,
  frontend_url: envVars.FRONTEND_URL || "http://localhost:5173"
};