import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { apiRequest, formatApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import FormDialog from "../shared/FormDialog";
import ResourcePage from "../shared/ResourcePage";
import { useApiResource } from "../shared/useApiResource";
import RouteMap from "./RouteMap";

export default function RoutesPage() {
  const { session, logout } = useAuth();
  const resource = useApiResource("/routes");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [optionsError, setOptionsError] = useState("");
  const [dialog, setDialog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [mappedRoute, setMappedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      apiRequest("/vehicles", { token: session.token }),
      apiRequest("/drivers", { token: session.token }),
      apiRequest("/orders", { token: session.token }),
    ])
      .then(([vehicleData, driverData, orderData]) => {
        setVehicles(
          vehicleData.filter((vehicle) => vehicle.status === "ACTIVE"),
        );
        setDrivers(driverData.filter((driver) => driver.status === "ACTIVE"));
        setOrders(orderData.filter((order) => order.status === "PENDING"));
      })
      .catch((error) => {
        if (error.status === 401) return logout();
        setOptionsError(formatApiError(error));
      });
  }, [logout, session.token]);

  async function submitResource(method, path, body) {
    setSubmitting(true);
    try {
      await resource.mutate(method, path, body);
      setDialog(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function createRoute(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    values.startsAt = new Date(values.startsAt).toISOString();
    values.endsAt = new Date(values.endsAt).toISOString();
    await submitResource("POST", "", values).catch(() => {});
  }

  async function assignDriver(event) {
    event.preventDefault();
    await submitResource(
      "PUT",
      `/${dialog.id}/driver`,
      Object.fromEntries(new FormData(event.currentTarget)),
    ).catch(() => {});
  }

  async function showRoute(route) {
    setMappedRoute(route);
    setMapLoading(true);
    setOptionsError("");
    try {
      setStops(
        await apiRequest(`/routes/${route.id}/stops`, { token: session.token }),
      );
    } catch (error) {
      setStops([]);
      setOptionsError(formatApiError(error));
    } finally {
      setMapLoading(false);
    }
  }

  async function optimizeRoute(event) {
    event.preventDefault();
    if (!selectedOrderIds.length) {
      setOptionsError("Seleccione al menos un pedido pendiente.");
      return;
    }
    const startsAt = new FormData(event.currentTarget).get("startsAt");
    setSubmitting(true);
    setOptionsError("");
    try {
      const optimized = await apiRequest("/optimizations", {
        token: session.token,
        method: "POST",
        body: JSON.stringify({
          orderIds: selectedOrderIds,
          startsAt: new Date(startsAt).toISOString(),
        }),
      });
      setOrders((current) =>
        current.filter((order) => !selectedOrderIds.includes(order.id)),
      );
      setSelectedOrderIds([]);
      await resource.load();
      setMappedRoute({
        ...optimized,
        optimized: true,
        vehiclePlate:
          vehicles.find((vehicle) => vehicle.id === optimized.vehicleId)
            ?.plate ?? "Vehículo asignado",
      });
      setStops(optimized.orders);
      setDialog(null);
    } catch (error) {
      setOptionsError(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ResourcePage
      title="Planificación de rutas"
      description="Optimiza hasta 50 pedidos y visualiza la secuencia geográfica calculada."
      {...resource}
      error={resource.error || optionsError}
      actionLabel="Nueva ruta manual"
      onAction={() => setDialog({ type: "route" })}
    >
      <Button
        sx={{ mb: 2 }}
        variant="outlined"
        disabled={!orders.length}
        onClick={() => {
          setSelectedOrderIds([]);
          setOptionsError("");
          setDialog({ type: "optimization" });
        }}
      >
        Optimizar pedidos
      </Button>
      {!orders.length && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay pedidos pendientes disponibles para optimizar.
        </Alert>
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Vehículo</TableCell>
            <TableCell>Inicio</TableCell>
            <TableCell>Fin</TableCell>
            <TableCell>Conductor</TableCell>
            <TableCell>Resultado</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {resource.items.map((route) => (
            <TableRow key={route.id} selected={mappedRoute?.id === route.id}>
              <TableCell>{route.vehiclePlate}</TableCell>
              <TableCell>
                {new Date(route.startsAt).toLocaleString("es-PE")}
              </TableCell>
              <TableCell>
                {new Date(route.endsAt).toLocaleString("es-PE")}
              </TableCell>
              <TableCell>{route.driverName ?? "Sin asignar"}</TableCell>
              <TableCell>
                {route.optimized
                  ? `${route.distanceKm ?? 0} km / ${route.totalWeightKg ?? 0} kg`
                  : "Manual"}
              </TableCell>
              <TableCell>
                {route.optimized && (
                  <Button onClick={() => showRoute(route)}>Ver mapa</Button>
                )}
                <Button onClick={() => setDialog({ type: "driver", ...route })}>
                  {route.driverId ? "Reasignar" : "Asignar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RouteMap route={mappedRoute} stops={stops} loading={mapLoading} />
      {dialog?.type === "route" && (
        <FormDialog
          open
          title="Nueva ruta operativa"
          onClose={() => setDialog(null)}
          onSubmit={createRoute}
          submitting={submitting}
        >
          <TextField
            name="vehicleId"
            label="Vehículo disponible"
            select
            required
            defaultValue=""
          >
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.id} value={vehicle.id}>
                {vehicle.plate}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="startsAt"
            label="Inicio"
            type="datetime-local"
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            name="endsAt"
            label="Fin (máximo 8 horas)"
            type="datetime-local"
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </FormDialog>
      )}
      {dialog?.type === "driver" && (
        <FormDialog
          open
          title="Asignar conductor"
          onClose={() => setDialog(null)}
          onSubmit={assignDriver}
          submitting={submitting}
        >
          <TextField
            name="driverId"
            label="Conductor disponible"
            select
            required
            defaultValue={dialog.driverId ?? ""}
          >
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {driver.name}
              </MenuItem>
            ))}
          </TextField>
        </FormDialog>
      )}
      {dialog?.type === "optimization" && (
        <FormDialog
          open
          title="Optimizar ruta"
          onClose={() => setDialog(null)}
          onSubmit={optimizeRoute}
          submitting={submitting}
        >
          {optionsError && <Alert severity="error">{optionsError}</Alert>}
          <TextField
            name="startsAt"
            label="Inicio de jornada"
            type="datetime-local"
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormControl required fullWidth>
            <InputLabel id="orders-label">Pedidos pendientes</InputLabel>
            <Select
              labelId="orders-label"
              label="Pedidos pendientes"
              multiple
              value={selectedOrderIds}
              onChange={(event) => setSelectedOrderIds(event.target.value)}
              renderValue={(values) =>
                `${values.length} pedido${values.length === 1 ? "" : "s"} seleccionado${values.length === 1 ? "" : "s"}`
              }
            >
              {orders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  <Checkbox checked={selectedOrderIds.includes(order.id)} />
                  <ListItemText
                    primary={`${order.priority === "HIGH" ? "Alta · " : ""}${order.address}`}
                    secondary={`${order.weightKg} kg · ${order.windowStart}-${order.windowEnd}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Alert severity="info">
            Se requiere un vehículo con capacidad suficiente, un conductor
            disponible y ventanas compatibles con el inicio elegido.
          </Alert>
        </FormDialog>
      )}
    </ResourcePage>
  );
}
