const CACHE_PREFIX = "wanka.field.route.";
const SYNC_PREFIX = "wanka.field.sync.";

function readJson(key, fallback) {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode: ignore; online path still works.
  }
}

export function loadCachedDriverRoute(userId) {
  return readJson(`${CACHE_PREFIX}${userId}`, null);
}

export function saveCachedDriverRoute(userId, payload) {
  writeJson(`${CACHE_PREFIX}${userId}`, {
    ...payload,
    savedAt: new Date().toISOString(),
  });
}

export function listPendingFieldSync(userId) {
  return readJson(`${SYNC_PREFIX}${userId}`, []);
}

export function queueFieldSync(userId, entry) {
  const pending = listPendingFieldSync(userId);
  pending.push(entry);
  writeJson(`${SYNC_PREFIX}${userId}`, pending);
}

export function clearPendingFieldSync(userId) {
  writeJson(`${SYNC_PREFIX}${userId}`, []);
}
