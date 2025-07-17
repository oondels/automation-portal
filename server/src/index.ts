import express, { Request, Response, NextFunction } from 'express';
import cors from "cors"
import http from "http"
import { projectRoute } from "./routes/project.route"
import { WsManager } from './websockets/manager';
import { config } from "./config/env" // Load and validate environment variables

(async () => {
  const app = express();
  const PORT = config.port;

  app.use(cors())
  app.use(express.json())
  app.use("/api/projects/", projectRoute)

  const server = http.createServer(app)
  const wsManager = new WsManager(server)

  // Health check
  app.get("/", (_, res: Response) => {
    res.status(200).json({ message: "Automation Service is running!" });
  })

  server.listen(PORT, () => {
    console.log(`Server is running on http://${config.env === 'development' ? 'localhost' : '10.100.1.43'}:${PORT}`);
  })
})()

