import express, { Request, Response, NextFunction } from 'express';
import cors from "cors"
import http from "http"
import cookieParser from "cookie-parser"
import { projectRoute } from "./routes/project.route"
import { WsManager } from './websockets/manager';
import { config } from "./config/env"
import { AppError } from './utils/AppError';
import { AppDataSource } from './config/data-source';

AppDataSource.initialize()
  .then(() => {

    (async () => {
      const app = express();
      const PORT = config.port;

      app.use(cors())
      app.use(cookieParser())
      app.use(express.json())
      app.use("/api/projects/", projectRoute)
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


