import { Pool, PoolClient } from "pg";

class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
     user: "postgres" as string,
    database: "fileserver" as string, 
    password: "postgres" as string,
    host: "localhost" as string,
    port: 5432 as number
    });
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
