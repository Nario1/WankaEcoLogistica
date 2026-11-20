import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import Co2RoundedIcon from "@mui/icons-material/Co2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import PropTypes from "prop-types";
import { cachedApiGet, formatApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import MetricCard from "../shared/MetricCard";

function defaultRange() {
  const to = new Date();
  const from = new Date(to.getTime() - 6 * 24 * 60 * 60 * 1000);
  const asInput = (date) => date.toISOString().slice(0, 10);
  return { from: asInput(from), to: asInput(to) };
}

function totalOf(payload) {
  if (Array.isArray(payload)) return payload.length;
  return payload?.pagination?.total ?? payload?.items?.length ?? 0;
}

export default function OverviewPage({ onNavigate }) {
  const { session, logout } = useAuth();
  const range = useMemo(() => defaultRange(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState(null);
  const role = session.user.role;
  const isDriver = role === "DRIVER";
  const canSeeOps = ["ADMIN", "OPERATOR", "AUDITOR"].includes(role);

  useEffect(() => {
    if (isDriver) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    const countQuery = "page=1&limit=1";
    const indicatorsQuery = new URLSearchParams({
      from: `${range.from}T00:00:00.000Z`,
      to: `${range.to}T23:59:59.999Z`,
    });
    Promise.all([
      cachedApiGet(`/orders?${countQuery}`, { token: session.token }),
      cachedApiGet(`/vehicles?${countQuery}`, { token: session.token }),
      cachedApiGet(`/routes?${countQuery}`, { token: session.token }),
      cachedApiGet(`/indicators?${indicatorsQuery}`, { token: session.token }),
    ])
      .then(([orders, vehicles, routes, indicators]) => {
        if (!active) return;
        setSnapshot({
          orders: totalOf(orders),
          vehicles: totalOf(vehicles),
          routes: totalOf(routes),
          indicators,
        });
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
  }, [isDriver, logout, range.from, range.to, session.token]);

  if (isDriver) {
    return (
      <Grid container spacing={2} sx={{ width: "100%", maxWidth: 1700 }}>
        <Grid size={12}>
          <Typography component="h1" variant="h5" fontWeight={700}>
            Dashboard de campo
          </Typography>
          <Typography color="text.secondary">
            Consulte su ruta asignada y la navegación del día.
          </Typography>
        </Grid>
        <Grid size={12}>
          <Button variant="contained" onClick={() => onNavigate?.("field")}>
            Ir a Mi ruta
          </Button>
        </Grid>
      </Grid>
    );
  }

  const indicators = snapshot?.indicators;
  const hasIndicators = indicators?.hasData === true;

  return (
    <Box sx={{ width: "100%", maxWidth: 1700 }}>
      <Stack spacing={2}>
        <Box>
          <Typography component="h1" variant="h5" fontWeight={700}>
            Dashboard operativo
          </Typography>
          <Typography color="text.secondary">
            Resumen de los últimos 7 días y totales actuales (datos en caché 60
            s).
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? (
          <CircularProgress aria-label="Cargando dashboard" />
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <MetricCard
                  icon={<AssignmentRoundedIcon color="primary" />}
                  title="Pedidos"
                  value={snapshot?.orders ?? 0}
                  detail="Total registrados"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <MetricCard
                  icon={<LocalShippingRoundedIcon color="success" />}
                  title="Vehículos"
                  value={snapshot?.vehicles ?? 0}
                  detail="Flota registrada"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <MetricCard
                  icon={<RouteRoundedIcon color="info" />}
                  title="Rutas"
                  value={snapshot?.routes ?? 0}
                  detail="Planificadas en el sistema"
                />
              </Grid>
            </Grid>

            {indicators?.hasData === false ? (
              <Alert severity="warning">{indicators.message}</Alert>
            ) : null}

            {hasIndicators ? (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <MetricCard
                    icon={<Co2RoundedIcon color="success" />}
                    title="CO₂ (7 días)"
                    value={`${indicators.co2.emissionsKgCo2} kg`}
                    detail={`${indicators.routeCount} rutas · ${indicators.orderCount} pedidos`}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <MetricCard
                    icon={<RouteRoundedIcon color="primary" />}
                    title="Ahorro distancia"
                    value={
                      indicators.distance.savedPercent == null
                        ? "N/D"
                        : `${indicators.distance.savedPercent} %`
                    }
                    detail={
                      indicators.distance.savedKm == null
                        ? "Sin línea base en el periodo"
                        : `${indicators.distance.savedKm} km ahorrados`
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <MetricCard
                    icon={<VerifiedRoundedIcon color="info" />}
                    title="Nivel de servicio"
                    value={
                      indicators.serviceLevel.percent == null
                        ? "N/D"
                        : `${indicators.serviceLevel.percent} %`
                    }
                    detail={`${indicators.serviceLevel.completedOrders} de ${indicators.serviceLevel.totalOrders} pedidos`}
                  />
                </Grid>
              </Grid>
            ) : null}

            {canSeeOps ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  variant="outlined"
                  onClick={() => onNavigate?.("orders")}
                >
                  Pedidos
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => onNavigate?.("routes")}
                >
                  Rutas
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => onNavigate?.("indicators")}
                >
                  Indicadores
                </Button>
              </Stack>
            ) : null}
          </>
        )}
      </Stack>
    </Box>
  );
}

OverviewPage.propTypes = {
  onNavigate: PropTypes.func,
};
