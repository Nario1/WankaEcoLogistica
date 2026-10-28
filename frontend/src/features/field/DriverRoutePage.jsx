import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { apiRequest, formatApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import RouteMap from "../routes/RouteMap";
import { formatDateTime } from "../../utils/format";
import {
  clearPendingFieldSync,
  listPendingFieldSync,
  loadCachedDriverRoute,
  queueFieldSync,
  saveCachedDriverRoute,
} from "./fieldOfflineCache";

function useOnlineStatus() {
  const [online, setOnline] = useState(
    () => globalThis.navigator?.onLine ?? true,
  );
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    globalThis.addEventListener("online", goOnline);
    globalThis.addEventListener("offline", goOffline);
    return () => {
      globalThis.removeEventListener("online", goOnline);
      globalThis.removeEventListener("offline", goOffline);
    };
  }, []);
  return online;
}

export default function DriverRoutePage() {
  const { session } = useAuth();
  const online = useOnlineStatus();
  const [routes, setRoutes] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [stops, setStops] = useState([]);
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromCache, setFromCache] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const selected = routes.find((route) => route.id === selectedId) ?? null;
  const cacheKey = session?.user?.id ?? "anonymous";

  const applyCache = useCallback(() => {
    const cached = loadCachedDriverRoute(cacheKey);
    if (!cached) return false;
    setRoutes(cached.routes ?? []);
    setSelectedId(cached.selectedId || cached.routes?.[0]?.id || "");
    setStops(cached.stops ?? []);
    setNavigation(cached.navigation ?? null);
    setFromCache(true);
    return true;
  }, [cacheKey]);

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const items = await apiRequest("/routes/mine", {
        token: session.token,
      });
      setRoutes(items);
      setSelectedId((current) => current || items[0]?.id || "");
      setFromCache(false);
      saveCachedDriverRoute(cacheKey, {
        routes: items,
        selectedId: items[0]?.id || "",
        stops: [],
        navigation: null,
      });
    } catch (requestError) {
      if (!applyCache()) {
        setError(formatApiError(requestError));
        setRoutes([]);
      } else {
        setError("");
      }
    } finally {
      setLoading(false);
    }
  }, [applyCache, cacheKey, session.token]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await Promise.resolve();
      if (!cancelled) await loadRoutes();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadRoutes]);

  useEffect(() => {
    if (!selectedId) return undefined;
    let cancelled = false;
    if (!online) {
      void (async () => {
        await Promise.resolve();
        if (!cancelled) applyCache();
      })();
      return () => {
        cancelled = true;
      };
    }
    void (async () => {
      setLoading(true);
      setError("");
      try {
        const [nextStops, nextNavigation] = await Promise.all([
          apiRequest(`/routes/${selectedId}/stops`, { token: session.token }),
          apiRequest(`/routes/${selectedId}/navigation`, {
            token: session.token,
          }).catch(() => null),
        ]);
        if (cancelled) return;
        setStops(nextStops);
        setNavigation(nextNavigation);
        setFromCache(false);
        saveCachedDriverRoute(cacheKey, {
          routes,
          selectedId,
          stops: nextStops,
          navigation: nextNavigation,
        });
      } catch (requestError) {
        if (cancelled) return;
        if (!applyCache()) {
          setError(formatApiError(requestError));
          setStops([]);
          setNavigation(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyCache, cacheKey, online, routes, selectedId, session.token]);

  useEffect(() => {
    if (!online) return undefined;
    const pending = listPendingFieldSync(cacheKey);
    if (!pending.length) return undefined;
    const pendingCount = pending.length;
    let cancelled = false;
    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setSyncMessage(
        `Sincronizando ${pendingCount} cambio(s) pendiente(s) al recuperar red…`,
      );
      clearPendingFieldSync(cacheKey);
      await loadRoutes();
      if (!cancelled) setSyncMessage("Cambios pendientes sincronizados.");
    })();
    return () => {
      cancelled = true;
    };
  }, [cacheKey, loadRoutes, online]);

  return (
    <Box sx={{ width: "100%", maxWidth: 1700 }}>
      <Stack spacing={2}>
        <Box>
          <Typography component="h1" variant="h5" fontWeight={700}>
            Mi ruta en el mapa
          </Typography>
          <Typography color="text.secondary">
            Consulte el trazado y las paradas de la ruta que tiene asignada.
          </Typography>
        </Box>
        {!online && (
          <Alert severity="warning">
            Sin conexión. Se muestra la última información cacheada
            {fromCache ? " de esta sesión" : ""}.
          </Alert>
        )}
        {online && fromCache && (
          <Alert severity="info">
            Mostrando datos cacheados mientras se recupera la información en
            línea.
          </Alert>
        )}
        {syncMessage && (
          <Alert severity="success" onClose={() => setSyncMessage("")}>
            {syncMessage}
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !routes.length && !error && (
          <Alert severity="info">
            No tiene rutas asignadas. El planificador debe vincularlo a una ruta
            optimizada.
          </Alert>
        )}
        {!!routes.length && (
          <TextField
            select
            label="Ruta asignada"
            value={selectedId}
            helperText="Elija la ruta que va a recorrer."
            onChange={(event) => {
              const nextId = event.target.value;
              setSelectedId(nextId);
              if (!online) {
                queueFieldSync(cacheKey, {
                  type: "SELECT_ROUTE",
                  routeId: nextId,
                  at: new Date().toISOString(),
                });
              }
            }}
            sx={{ maxWidth: 480 }}
          >
            {routes.map((route) => (
              <MenuItem key={route.id} value={route.id}>
                {route.vehiclePlate} · {formatDateTime(route.startsAt)} ·{" "}
                {route.status}
              </MenuItem>
            ))}
          </TextField>
        )}
        <RouteMap
          route={selected}
          stops={selectedId ? stops : []}
          navigation={selectedId ? navigation : null}
          loading={loading}
        />
      </Stack>
    </Box>
  );
}
