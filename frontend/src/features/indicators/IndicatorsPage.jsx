import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import Co2RoundedIcon from "@mui/icons-material/Co2Rounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { apiDownload, apiRequest, formatApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";

function defaultRange() {
  const to = new Date();
  const from = new Date(to.getTime() - 6 * 24 * 60 * 60 * 1000);
  const asInput = (date) => date.toISOString().slice(0, 10);
  return { from: asInput(from), to: asInput(to) };
}

function toIsoStart(date) {
  return `${date}T00:00:00.000Z`;
}

function toIsoEnd(date) {
  return `${date}T23:59:59.999Z`;
}

function MetricCard({ icon, title, value, detail }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
          {icon}
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Stack>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        {detail ? (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {detail}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function IndicatorsPage() {
  const { session, logout } = useAuth();
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [focus, setFocus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState("");
  const [error, setError] = useState("");
  const [indicators, setIndicators] = useState(null);
  const canExport =
    session.user.role === "ADMIN" || session.user.role === "AUDITOR";

  async function loadIndicators(event) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        from: toIsoStart(from),
        to: toIsoEnd(to),
      });
      setIndicators(
        await apiRequest(`/indicators?${query}`, { token: session.token }),
      );
    } catch (requestError) {
      if (requestError.status === 401) {
        logout();
        return;
      }
      setIndicators(null);
      setError(formatApiError(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function exportReport(format) {
    setExporting(format);
    setError("");
    try {
      const query = new URLSearchParams({
        from: toIsoStart(from),
        to: toIsoEnd(to),
        format,
      });
      await apiDownload(`/reports/export?${query}`, {
        token: session.token,
        filename: `reporte-operacion.${format}`,
      });
    } catch (requestError) {
      if (requestError.status === 401) {
        logout();
        return;
      }
      setError(formatApiError(requestError));
    } finally {
      setExporting("");
    }
  }

  const showCo2 = focus === "all" || focus === "co2";
  const showDistance = focus === "all" || focus === "distance";
  const showService = focus === "all" || focus === "service";

  return (
    <Box sx={{ width: "100%", maxWidth: 1700 }}>
      <Stack spacing={2}>
        <Box>
          <Typography component="h1" variant="h5" fontWeight={700}>
            Indicadores de sostenibilidad
          </Typography>
          <Typography color="text.secondary">
            Consulte CO₂, ahorro de distancia y nivel de servicio por periodo
            (US-006 / RF-006).
          </Typography>
        </Box>

        <Card component="form" onSubmit={loadIndicators}>
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ md: "flex-end" }}
            >
              <TextField
                label="Desde"
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                label="Hasta"
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 160 }}
              >
                {loading ? "Calculando…" : "Consultar"}
              </Button>
            </Stack>
            {canExport ? (
              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  disabled={Boolean(exporting)}
                  onClick={() => exportReport("csv")}
                >
                  {exporting === "csv" ? "Exportando…" : "Exportar CSV"}
                </Button>
                <Button
                  variant="outlined"
                  disabled={Boolean(exporting)}
                  onClick={() => exportReport("pdf")}
                >
                  {exporting === "pdf" ? "Exportando…" : "Exportar PDF"}
                </Button>
              </Stack>
            ) : null}
          </CardContent>
        </Card>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {indicators?.hasData === false ? (
          <Alert severity="warning">{indicators.message}</Alert>
        ) : null}

        {indicators?.hasData ? (
          <>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                size="small"
                variant={focus === "all" ? "contained" : "outlined"}
                onClick={() => setFocus("all")}
              >
                Todos
              </Button>
              <Button
                size="small"
                variant={focus === "co2" ? "contained" : "outlined"}
                onClick={() => setFocus("co2")}
              >
                Solo emisiones
              </Button>
              <Button
                size="small"
                variant={focus === "distance" ? "contained" : "outlined"}
                onClick={() => setFocus("distance")}
              >
                Solo distancia
              </Button>
              <Button
                size="small"
                variant={focus === "service" ? "contained" : "outlined"}
                onClick={() => setFocus("service")}
              >
                Solo servicio
              </Button>
            </Stack>

            <Grid container spacing={2}>
              {showCo2 ? (
                <Grid size={{ xs: 12, md: 4 }}>
                  <MetricCard
                    icon={<Co2RoundedIcon color="success" />}
                    title="Emisiones CO₂"
                    value={`${indicators.co2.emissionsKgCo2} kg`}
                    detail={`Factor ${indicators.co2.emissionFactorUsed} kg/km · referencia sierra central ${indicators.co2.referenceFactor}`}
                  />
                </Grid>
              ) : null}
              {showDistance ? (
                <Grid size={{ xs: 12, md: 4 }}>
                  <MetricCard
                    icon={<RouteRoundedIcon color="primary" />}
                    title="Ahorro de distancia"
                    value={
                      indicators.distance.savedPercent == null
                        ? "N/D"
                        : `${indicators.distance.savedPercent} %`
                    }
                    detail={
                      indicators.distance.savedKm == null
                        ? "Sin línea base registrada en el periodo"
                        : `${indicators.distance.savedKm} km ahorrados (${indicators.distance.optimizedKm} km vs ${indicators.distance.baselineKm} km base)`
                    }
                  />
                </Grid>
              ) : null}
              {showService ? (
                <Grid size={{ xs: 12, md: 4 }}>
                  <MetricCard
                    icon={<VerifiedRoundedIcon color="info" />}
                    title="Nivel de servicio"
                    value={
                      indicators.serviceLevel.percent == null
                        ? "N/D"
                        : `${indicators.serviceLevel.percent} %`
                    }
                    detail={`${indicators.serviceLevel.completedOrders} de ${indicators.serviceLevel.totalOrders} pedidos en rutas completadas`}
                  />
                </Grid>
              ) : null}
              <Grid size={{ xs: 12, md: 4 }}>
                <MetricCard
                  icon={<AssessmentRoundedIcon />}
                  title="Operación del periodo"
                  value={`${indicators.routeCount} rutas`}
                  detail={`${indicators.orderCount} pedidos asociados`}
                />
              </Grid>
            </Grid>
          </>
        ) : null}
      </Stack>
    </Box>
  );
}
