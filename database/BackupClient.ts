import { Client } from "pg";
import { Db } from "./Db";

export class BackupClient implements Db {
  private clientInstance: Client | null = null;

  constructor(
    private user: string,
    private host: string,
    private database: string,
    private password: string = null,
    private port: number = 5432
  ) {}

  private createClient(): Client {
    return new Client({
      user: this.user,
      host: this.host,
      database: this.database,
      password: this.password,
      port: this.port,
    });
  }

  public client(): Client {
    if (!this.clientInstance) {
      this.clientInstance = this.createClient();
    }
    return this.clientInstance;
  }

  public async connect() {
    try {
      await this.client().connect();
      console.log("Connected to PostgreSQL");
    } catch (error) {
      console.error("Error connecting to PostgreSQL: ", error);
    }
  }

  public async disconnect() {
    try {
      if (this.clientInstance) {
        await this.clientInstance.end();
        console.log("Disconnected from PostgreSQL");
      }
    } catch (error) {
      console.error("Error disconnecting from PostgreSQL: ", error);
    }
  }
}
