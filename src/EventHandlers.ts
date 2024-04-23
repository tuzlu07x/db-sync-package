import { Client } from "pg";
import { EventEmitter } from "events";
import { Action } from "../database/Enum/DatabaseEnum";

export class EventHandlers {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  onChange(type: string, callback: (...args: any[]) => void) {
    this.emitter.on(type, callback);
  }

  async initEventListener(client: Client): Promise<void> {
    client.on("notification", (msg: any) => {
      const payload = JSON.parse(msg.payload);
      const { table, action, data } = payload;

      switch (action) {
        case "INSERT":
          this.emitter.emit("insert", { table, data });
          break;
        case "DELETE":
          this.emitter.emit("delete", { table, data });
          break;
        case "UPDATE":
          this.emitter.emit("update", { table, data });
          break;
        default:
          break;
      }
    });
    await client.query("LISTEN events");
  }
}
