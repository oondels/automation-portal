import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express';
import cors from "cors"
import http from "http"
import cookieParser from "cookie-parser"
import { projectRoute } from "./routes/project.route"
import { approverRoute } from "./routes/approver.route"
import { configRoute } from "./routes/config.route"
import { WsManager, setWsManagerInstance } from './websockets/manager';
import { config } from "./config/env"
import { AppError } from './utils/AppError';
import { AppDataSource } from './config/data-source';

AppDataSource.initialize()
  .then(() => {
    (async () => {
      const app = express();
      const PORT = config.port;

      app.use(cookieParser())
      app.use(cors({ origin: ["http://localhost:5173", "http://10.100.1.43", "http://10.100.1.43:5173", "http://10.100.1.43:3046", "http://localhost:3046"], credentials: true }))
      app.use(express.json())
      app.use("/api/projects/", projectRoute)
      app.use("/api/approvers/", approverRoute)
      // Config endpoints (compatível com chamadas /api/config/* e /config/*)
      app.use("/api/config/", configRoute)
      app.use("/config/", configRoute)
      // Error Handler
      app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(`Error on method ${req.method} - ${req.originalUrl}:`, error);
        if (error instanceof AppError) {
          res.status(error.statusCode).json({ message: error.message });
          return
        }

        res.status(500).json({
          message: "Internal Server Error",
          error: config.env === 'development' ? error.message || "An unexpected error occurred" : undefined
        });
        return
      })

      const server = http.createServer(app)
      const wsManager = new WsManager(server)
      setWsManagerInstance(wsManager)

      // Health check
      app.get("/", (_, res: Response) => {
        res.status(200).json({ message: "Automation Service is running!" });
      })

      server.listen(PORT, () => {
        console.log(`Server is running on http://${config.env === 'development' ? 'localhost' : '10.100.1.43'}:${PORT}`);
      })
    })();

  })
  .catch(error => {
    console.error("Error initializing DataSource", error);
    process.exit(1);
  });
