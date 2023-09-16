import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import passwordRoutes from "./routes/passwordRoutes";
import db from "./connection/database";
import fileRoutes from "./routes/fileRoutes";
import downloadRoutes from "./routes/downloadRoutes";
import path from "path"; 
import dotenv from "dotenv";

dotenv.config();



export class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = 5000;

    this.connectDatabase();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureEJS();
    this.configureStaticDirectories(); 
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
      console.error("Error connecting to the database:", error);
    }
  }

  private configureEJS(): void {
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "..", "src", "views"));
  }


  private configureStaticDirectories(): void {
    this.app.use(express.static(path.join(__dirname, "public")));
  }


  private startServer(): void {
    this.app.get("/", (req, res) => {
      res.render("login");
    })

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}

new Server();
