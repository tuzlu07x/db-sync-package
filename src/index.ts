import { DatabaseSync } from "./DatabaseSync";
import { PrimaryClient } from "../database/PrimaryClient";
import { EventHandlers } from "./EventHandlers";
import { Action } from "../database/Enum/DatabaseEnum";

const primaryClient = new PrimaryClient(
  "your_primary_user",
  "your_primary_host",
  "your_primary_database",
  "your_primary_password"
);

const backupClient = new PrimaryClient(
  "your_backup_user",
  "your_backup_host",
  "your_backup_database",
  "your_backup_password"
);

const eventHandlers = new EventHandlers();

async function main() {
  await primaryClient.connect();
  await backupClient.connect();

  const databaseSync = new DatabaseSync({
    primaryClient: primaryClient.client(),
    backupClient: backupClient.client(),
  });

  // EventHandlers ile olayları dinleme
  await eventHandlers.initEventListener(primaryClient.client());

  // INSERT olayını dinleme
  eventHandlers.onChange("insert", async (event: any) => {
    const { table, data } = event;
    console.log(`INSERT event received for table ${table}:`, data);
    await databaseSync.syncTable(table, Action.INSERT, data);
  });

  // DELETE olayını dinleme
  eventHandlers.onChange("delete", async (event: any) => {
    const { table, data } = event;
    console.log(`DELETE event received for table ${table}:`, data);
    await databaseSync.syncTable(table, Action.DELETE, data);
  });

  // UPDATE olayını dinleme
  eventHandlers.onChange("update", async (event: any) => {
    const { table, data } = event;
    console.log(`UPDATE event received for table ${table}:`, data);
    await databaseSync.syncTable(table, Action.UPDATE, data);
  });
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
