import { DatabaseSqlInterface } from "../database/Interface/DatabaseInterface";

export abstract class DatabaseChanges {
  constructor(protected databaseInterface: DatabaseSqlInterface) {}

  protected async backupInsert(table: string, data: any) {
    try {
      const { rows } = await this.databaseInterface.backupClient.query(
        `INSERT INTO ${table} VALUES ($1)`,
        [data]
      );
      console.log("Backup insert:", rows);
    } catch (error) {
      console.error("Error backing up insert:", error);
    }
  }

  protected async backupUpdate(table: string, data: any) {
    try {
      const { rows } = await this.databaseInterface.backupClient.query(
        `UPDATE ${table} SET ... WHERE id = $1`,
        [data.id]
      );
      console.log("Backup update:", rows);
    } catch (error) {
      console.error("Error backing up update:", error);
    }
  }

  protected async backupDelete(table: string, data: any) {
    try {
      const { rows } = await this.databaseInterface.backupClient.query(
        `DELETE FROM ${table} WHERE id = $1`,
        [data.id]
      );
      console.log("Backup delete:", rows);
    } catch (error) {
      console.error("Error backing up delete:", error);
    }
  }
}
