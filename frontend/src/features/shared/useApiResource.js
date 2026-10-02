import { useCallback, useEffect, useState } from "react";
import { apiRequest, formatApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";

export function useApiResource(path) {
  const { session, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await apiRequest(path, { token: session.token }));
    } catch (requestError) {
      if (requestError.status === 401) {
        logout();
        return;
      }
      setError(formatApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, [logout, path, session.token]);

  useEffect(() => {
    let active = true;
    apiRequest(path, { token: session.token })
      .then((data) => {
        if (active) setItems(data);
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
  }, [logout, path, session.token]);

  async function mutate(method, suffix, body) {
    setError("");
    try {
      const result = await apiRequest(`${path}${suffix}`, {
        method,
        token: session.token,
        body: JSON.stringify(body),
      });
      await load();
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

  return { items, error, loading, load, mutate };
}
