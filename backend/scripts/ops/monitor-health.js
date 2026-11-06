import { evaluateHealth } from "../../src/ops/recovery.js";

const baseUrl = process.env.MONITOR_BASE_URL ?? "http://127.0.0.1:3000";
const intervalMs = Number(process.env.MONITOR_INTERVAL_MS ?? 5_000);
const once = process.argv.includes("--once");

async function probe() {
  const started = Date.now();
  try {
    const live = await fetch(`${baseUrl}/health`);
    const ready = await fetch(`${baseUrl}/health/ready`);
    const readyBody = await ready.json().catch(() => ({}));
    const databaseOk =
      ready.ok && readyBody?.data?.checks?.database === "ok";
    const summary = evaluateHealth({ databaseOk });
    const latencyMs = Date.now() - started;
    console.error(
      `[${summary.checkedAt}] api=${live.ok ? "ok" : "down"} db=${summary.checks.database} latency=${latencyMs}ms`,
    );
    if (!live.ok || !databaseOk) process.exitCode = 1;
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] monitor_error=${error.message}`,
    );
    process.exitCode = 1;
  }
}

await probe();
if (!once) {
  setInterval(probe, intervalMs);
}
