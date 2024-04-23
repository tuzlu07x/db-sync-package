import { Client } from "pg";
import { Action } from "../Enum/DatabaseEnum";
import { EventEmitter } from "stream";

export interface DatabaseSqlInterface {
  primaryClient: Client;
  backupClient: Client;
}

export interface SyncEvent {
  table: string;
  action: Action;
  data: any;
}

export interface DatabaseSyncInterface {
  databaseInterface: DatabaseSqlInterface;
  startListening(): Promise<void>;
  onSync(callback: (event: SyncEvent) => void): void;
  syncTable(table: string, action: Action, data: any): Promise<void>;
}
