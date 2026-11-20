import { useCallback, useEffect, useState } from "react";
import { apiRequest, formatApiError } from "../../api/client";
import {
  getCachedResource,
  invalidateResourceCache,
  setCachedResource,
} from "../../api/resourceCache";
import { useAuth } from "../../auth/AuthContext";

const DEFAULT_LIMIT = 12;
const LIST_TTL_MS = 60_000;

function buildPath(path, page, limit) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}page=${page}&limit=${limit}`;
}

export function useApiResource(path, { limit = DEFAULT_LIMIT } = {}) {
  const { session, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const applyPayload = useCallback(
    (payload) => {
      if (Array.isArray(payload)) {
        setItems(payload);
        setPagination({
          total: payload.length,
          page: 1,
          limit: payload.length || limit,
          totalPages: payload.length ? 1 : 0,
        });
        return;
      }
      setItems(payload?.items ?? []);
      setPagination(
        payload?.pagination ?? {
          total: 0,
          page: 1,
          limit,
          totalPages: 0,
        },
      );
    },
    [limit],
  );

  const fetchPage = useCallback(
    async (nextPage, { force = false } = {}) => {
      const requestPath = buildPath(path, nextPage, limit);
      if (!force) {
        const cached = getCachedResource(
          requestPath,
          session.token,
          LIST_TTL_MS,
        );
        if (cached != null) {
          applyPayload(cached);
          setPage(nextPage);
          setLoading(false);
          setError("");
          return cached;
        }
      }
      const payload = await apiRequest(requestPath, {
        token: session.token,
      });
      setCachedResource(requestPath, session.token, payload);
      applyPayload(payload);
      setPage(nextPage);
      return payload;
    },
    [applyPayload, limit, path, session.token],
  );

  const load = useCallback(
    async (nextPage = page) => {
      setLoading(true);
      setError("");
      try {
        await fetchPage(nextPage, { force: true });
      } catch (requestError) {
        if (requestError.status === 401) {
          logout();
          return;
        }
        setError(formatApiError(requestError));
      } finally {
        setLoading(false);
      }
    },
    [fetchPage, logout, page],
  );

  useEffect(() => {
    let active = true;
    const requestPath = buildPath(path, 1, limit);
    const cached = getCachedResource(requestPath, session.token, LIST_TTL_MS);
    if (cached != null) {
      applyPayload(cached);
      setPage(1);
      setLoading(false);
      setError("");
      return () => {
        active = false;
      };
    }

    setLoading(true);
    apiRequest(requestPath, { token: session.token })
      .then((payload) => {
        if (!active) return;
        setCachedResource(requestPath, session.token, payload);
        applyPayload(payload);
        setPage(1);
      })
      .catch((requestError) => {
        if (requestError.status === 401) {
          logout();
          return;
        }
        if (active) setError(formatApiError(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [applyPayload, limit, logout, path, session.token]);

  async function mutate(method, suffix, body) {
    setError("");
    try {
      const result = await apiRequest(`${path}${suffix}`, {
        method,
        token: session.token,
        body: JSON.stringify(body),
      });
      invalidateResourceCache(path, session.token);
      await load(page);
      return result;
    } catch (requestError) {
      if (requestError.status === 401) {
        logout();
        throw requestError;
      }
      setError(formatApiError(requestError));
      throw requestError;
    }
  }

  return {
    items,
    pagination,
    page,
    setPage: (value) => {
      const next = typeof value === "function" ? value(page) : value;
      return load(next);
    },
    error,
    loading,
    load,
    mutate,
  };
}
