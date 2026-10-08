import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadConfig } from "../src/config/env.js";
import { createPool } from "../src/config/database.js";

const directory = dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = join(directory, "..", "migrations");
const migrationFiles = (await fs.readdir(migrationsDirectory))
  .filter((file) => file.endsWith(".sql"))
  .sort();
const pool = createPool(loadConfig());
try {
  for (const migrationFile of migrationFiles) {
    const sql = await fs.readFile(
      join(migrationsDirectory, migrationFile),
      "utf8",
    );
    await pool.query(sql);
    console.error(`Migración aplicada: ${migrationFile}`);
  }
} finally {
  await pool.end();
}
