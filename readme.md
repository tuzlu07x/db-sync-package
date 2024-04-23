# Database Sync Package

This package provides a solution for synchronizing data between a primary and a backup database. It allows you to listen for database events such as INSERT, UPDATE, and DELETE and replicate these changes to a backup database.

## Installation

To install the package, run the following command:

# Usage

```ts
import { Client } from "pg";
import { DatabaseSync } from "db-sync-package";
import { EventHandlers } from "db-sync-package";
import { PrimaryClient } from "db-sync-package";
import { BackupClient } from "db-sync-package";

const primaryClient = new PrimaryClient(
  "your_primary_user",
  "your_primary_host",
  "your_primary_database",
  "your_primary_password"
);

const backupClient = new BackupClient(
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

  //Listen events with EventHandlers
  await eventHandlers.initEventListener(primaryClient.client());

  // Listen INSERT
  eventHandlers.onInsert("insert", async (event: any) => {
    const { table, data } = event;
    console.log(`INSERT event received for table ${table}:`, data);
    await databaseSync.syncTable(table, "INSERT", data);
  });

  // Listen DELETE
  eventHandlers.onInsert("delete", async (event: any) => {
    const { table, data } = event;
    console.log(`DELETE event received for table ${table}:`, data);
    await databaseSync.syncTable(table, "DELETE", data);
  });

  // Listen UPDATE
  eventHandlers.onInsert("update", async (event: any) => {
    const { table, data } = event;
    console.log(`UPDATE event received for table ${table}:`, data);
    await databaseSync.syncTable(table, "UPDATE", data);
  });
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
```

# Features

- Listen for database events such as INSERT, UPDATE, and DELETE.
- Replicate changes to a backup database.
- Easy to use and integrate with existing projects.
