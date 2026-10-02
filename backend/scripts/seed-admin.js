import bcrypt from "bcryptjs";
import { loadConfig } from "../src/config/env.js";
import { createPool } from "../src/config/database.js";

const config = loadConfig();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  throw new Error(
    "ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres) son obligatorios",
  );
}
const pool = createPool(config);
try {
  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO usuarios (email, nombre, password_hash, rol)
     VALUES ($1, 'Administrador', $2, 'ADMIN')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, passwordHash],
  );
  console.error("Administrador creado o actualizado");
} finally {
  await pool.end();
}
