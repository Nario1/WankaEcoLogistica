import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadConfig } from "../src/config/env.js";
import { createPool } from "../src/config/database.js";

const directory = dirname(fileURLToPath(import.meta.url));
const sql = await fs.readFile(
  join(directory, "..", "migrations", "001_sprint_1.sql"),
  "utf8",
);
const pool = createPool(loadConfig());
try {
  await pool.query(sql);
  console.error("Migración Sprint 1 aplicada");
} finally {
  await pool.end();
}
