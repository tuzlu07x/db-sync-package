import { Client } from "pg";
import { Db } from "./Db";

export class PrimaryClient implements Db {
  constructor(
    private user: string,
    private host: string,
    private database: string,
    private password: string,
    private port: number = 5432
  ) {}

  client(): Client {
    return new Client({
      user: this.user,
      host: this.host,
      database: this.database,
      password: this.password,
      port: this.port,
    });
  }

  async connect(): Promise<any> {
    await this.client().connect();
  }
}
