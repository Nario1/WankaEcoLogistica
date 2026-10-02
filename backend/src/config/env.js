import "dotenv/config";

const parsePort = (value) => {
  const port = Number(value ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un puerto válido");
  }
  return port;
};

export function loadConfig(env = process.env) {
  const isTest = env.NODE_ENV === "test";
  const jwtSecret = env.JWT_SECRET;

  if (!isTest && (!jwtSecret || jwtSecret.length < 32)) {
    throw new Error("JWT_SECRET debe contener al menos 32 caracteres");
  }

  return {
    nodeEnv: env.NODE_ENV ?? "development",
    port: parsePort(env.PORT),
    databaseUrl: env.DATABASE_URL,
    databaseSsl: env.DATABASE_SSL === "true",
    jwtSecret: jwtSecret ?? "test-secret-that-is-at-least-32-chars",
    jwtExpiresIn: env.JWT_EXPIRES_IN ?? "15m",
    corsOrigin: env.CORS_ORIGIN ?? "http://localhost:5173",
  };
}
