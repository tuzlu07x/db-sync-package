import { EventEmitter } from "events";
import {
  DatabaseSqlInterface,
  DatabaseSyncInterface,
  SyncEvent,
} from "../database/Interface/DatabaseInterface";
import { Action } from "../database/Enum/DatabaseEnum";
import { DatabaseChanges } from "./DatabaseChanges";

export class DatabaseSync
  extends DatabaseChanges
  implements DatabaseSyncInterface
{
  private eventEmitter: EventEmitter;

  constructor(public databaseInterface: DatabaseSqlInterface) {
    super(databaseInterface);
    this.eventEmitter = new EventEmitter();
  }

  public async startListening() {
    await this.databaseInterface.primaryClient.query("LISTEN events");
    this.databaseInterface.primaryClient.on(
      "notification",
      this.handleNotification.bind(this)
    );
  }

  public async syncTable(table: string, action: Action, data: any) {
    switch (action) {
      case Action.INSERT:
        await this.backupInsert(table, data);
        break;
      case Action.DELETE:
        await this.backupDelete(table, data);
        break;
      case Action.UPDATE:
        await this.backupUpdate(table, data);
        break;
      default:
        break;
    }
  }

  private async handleNotification(msg: any) {
    const payload = JSON.parse(msg.payload);
    const { table, action, data } = payload;
    const event: SyncEvent = { table, action, data };
    this.eventEmitter.emit("sync", event);
  }

  public onSync(callback: (event: SyncEvent) => void) {
    this.eventEmitter.on("sync", callback);
  }
}
