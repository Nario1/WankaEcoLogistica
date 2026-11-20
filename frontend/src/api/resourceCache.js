const DEFAULT_TTL_MS = 60_000;

/** Caché en memoria por URL+token para evitar refetch al cambiar de módulo. */
const entries = new Map();

function cacheKey(path, token) {
  return `${token ?? ""}::${path}`;
}

export function getCachedResource(path, token, ttlMs = DEFAULT_TTL_MS) {
  const key = cacheKey(path, token);
  const entry = entries.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > ttlMs) {
    entries.delete(key);
    return null;
  }
  return entry.payload;
}

export function setCachedResource(path, token, payload) {
  entries.set(cacheKey(path, token), { payload, at: Date.now() });
}

/**
 * Invalida entradas cuyo path empiece por el prefijo (p. ej. "/orders").
 * Sin prefijo, limpia toda la caché de la sesión.
 */
export function invalidateResourceCache(pathPrefix, token) {
  const tokenPart = `${token ?? ""}::`;
  for (const key of entries.keys()) {
    if (!key.startsWith(tokenPart)) continue;
    const path = key.slice(tokenPart.length);
    if (!pathPrefix || path === pathPrefix || path.startsWith(`${pathPrefix}?`) || path.startsWith(`${pathPrefix}/`)) {
      entries.delete(key);
    }
  }
}

export function clearResourceCache() {
  entries.clear();
}
