import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";
import { createContainer } from "./container.js";

const config = loadConfig();
const container = createContainer(config);
const app = createApp({ config, services: container.services });

const server = app.listen(config.port, () => {
  console.error(`API disponible en http://localhost:${config.port}`);
});

async function shutdown() {
  server.close(async () => {
    await container.pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
