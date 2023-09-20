import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

class Database {
  private pool: Pool;

  constructor() {
    // this.pool = new Pool({
    //  user: process.env.DB_USER as string,
    // database: process.env.DB_NAME as string,
    // password: process.env.DB_PASSWORD as string,
    // host: process.env.DB_HOST as string,
    // port: 5432 as number
    // });
    this.pool = new Pool({
      connectionString: process.env.CONNECTION_STRING as string,
  })
  }

  public async connect(): Promise<void> {
    try {
      const client: PoolClient = await this.pool.connect();
      console.log("Connected to database");
      client.release();
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error; 
    }
  }

  public query(text: string, values: any[]): Promise<any> {
    return this.pool.query(text, values);
  }

  public async close(): Promise<void> {
    await this.pool.end();
    console.log("Database connection pool closed");
  }
}

const db = new Database();

export default db;
