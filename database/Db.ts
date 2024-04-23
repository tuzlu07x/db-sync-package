import { Client } from "pg";

export interface Db {
  client(): Client;
}
