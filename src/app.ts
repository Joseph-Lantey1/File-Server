import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import passwordRoutes from "./routes/passwordRoutes";
import db from "./connection/database";
import fileRoutes from "./routes/fileRoutes";
import downloadRoutes from "./routes/downloadRoutes";

dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = 5000;

    this.connectDatabase();

    this.configureMiddleware();
    this.configureRoutes();
    this.startServer();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    this.app.use("/api", userRoutes);
    this.app.use("/api", passwordRoutes);
    this.app.use("/api", fileRoutes);
    this.app.use("/api", downloadRoutes);
  }

  private async connectDatabase(): Promise<void> {
    try {
      await db.connect(); // Connect to the database
    } catch (error) {
      console.error("Error connecting to the database:");
    }
  }

  private startServer(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}

new Server();
