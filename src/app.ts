import express, { Application } from "express";
import dotenv from "dotenv";
import db from "./connection/database";
 // Update the path to your database module

dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "4000", 10);

    this.connectDatabase(); 

    this.startServer();
  }

  private async connectDatabase(): Promise<void> {
    try {
      await db.connect(); // Connect to the database
    } catch (error) {
      console.error("Error connecting to the database:", error);
      process.exit(1); // Exit the application if the database connection fails
    }
  }

  private startServer(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}

new Server();
