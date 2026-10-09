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
import { formatDateTime, formatTime } from "../../utils/format";

function toLocalDateTimeInput(value) {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export default function RoutesPage() {
  const { session, logout } = useAuth();
  const resource = useApiResource("/routes");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [optionsError, setOptionsError] = useState("");
  const [dialog, setDialog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [mappedRoute, setMappedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [navigation, setNavigation] = useState(null);
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
    if (!selectedOrderIds.length || !selectedVehicleId) {
      setOptionsError(
        "Seleccione pedidos y una unidad que cumpla las condiciones.",
      );
      return;
    }
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const startsAt = new Date(values.startsAt).toISOString();
    const endsAt = new Date(values.endsAt).toISOString();
    setSubmitting(true);
    setOptionsError("");
    try {
      const route = await apiRequest("/routes", {
        token: session.token,
        method: "POST",
        body: JSON.stringify({
          vehicleId: selectedVehicleId,
          startsAt,
          endsAt,
        }),
      });
      await apiRequest(`/routes/${route.id}/driver`, {
        token: session.token,
        method: "PUT",
        body: JSON.stringify({ driverId: values.driverId }),
      });
      const optimized = await apiRequest("/optimizations", {
        token: session.token,
        method: "POST",
        body: JSON.stringify({
          routeId: route.id,
          vehicleId: selectedVehicleId,
          orderIds: selectedOrderIds,
          startsAt,
        }),
      });
      setOrders((current) =>
        current.filter((order) => !selectedOrderIds.includes(order.id)),
      );
      setDialog(null);
      await resource.load();
      await showRoute({
        ...optimized,
        optimized: true,
        vehiclePlate:
          vehicles.find((vehicle) => vehicle.id === selectedVehicleId)?.plate ??
          "Vehículo asignado",
      });
    } catch (error) {
      setOptionsError(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
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
    setStops([]);
    setNavigation(null);
    const [stopsResult, navigationResult] = await Promise.allSettled([
      apiRequest(`/routes/${route.id}/stops`, { token: session.token }),
      apiRequest(`/routes/${route.id}/navigation`, { token: session.token }),
    ]);
    setStops(stopsResult.status === "fulfilled" ? stopsResult.value : []);
    setNavigation(
      navigationResult.status === "fulfilled" ? navigationResult.value : null,
    );
    const failure = [stopsResult, navigationResult].find(
      (result) => result.status === "rejected",
    );
    if (failure) {
      setOptionsError(formatApiError(failure.reason));
    }
    setMapLoading(false);
  }

  async function optimizeRoute(event) {
    event.preventDefault();
    if (!selectedOrderIds.length) {
      setOptionsError("Seleccione al menos un pedido pendiente.");
      return;
    }
    const vehicle = vehicles.find((item) => item.id === selectedVehicleId);
    const totalWeightKg = orders
      .filter((order) => selectedOrderIds.includes(order.id))
      .reduce((total, order) => total + order.weightKg, 0);
    if (vehicle && totalWeightKg > vehicle.capacityKg * 0.95) {
      setOptionsError(
        `El peso seleccionado supera los ${(vehicle.capacityKg * 0.95).toFixed(2)} kg permitidos para ${vehicle.plate}.`,
      );
      return;
    }
    if (!vehicle) {
      setOptionsError(
        "No hay unidades activas que cumplan las condiciones de capacidad.",
      );
      return;
    }
    setSubmitting(true);
    setOptionsError("");
    const startsAt = new FormData(event.currentTarget).get("startsAt");
    try {
      const optimized = await apiRequest("/optimizations", {
        token: session.token,
        method: "POST",
        body: JSON.stringify({
          routeId: dialog.id,
          vehicleId: selectedVehicleId,
          orderIds: selectedOrderIds,
          startsAt: new Date(startsAt).toISOString(),
        }),
      });
      setOrders((current) =>
        current.filter((order) => !selectedOrderIds.includes(order.id)),
      );
      setSelectedOrderIds([]);
      await resource.load();
      const mapped = {
        ...optimized,
        optimized: true,
        vehiclePlate:
          vehicles.find((vehicle) => vehicle.id === optimized.vehicleId)
            ?.plate ?? "Vehículo asignado",
      };
      setDialog(null);
      await showRoute(mapped);
    } catch (error) {
      setOptionsError(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  }

  const selectedWeightKg = orders
    .filter((order) => selectedOrderIds.includes(order.id))
    .reduce((total, order) => total + order.weightKg, 0);
  const eligibleVehicles = vehicles
    .filter((vehicle) => vehicle.capacityKg * 0.95 >= selectedWeightKg)
    .sort((left, right) => left.capacityKg - right.capacityKg);
  const selectedVehicle = selectedVehicleId
    ? vehicles.find((vehicle) => vehicle.id === selectedVehicleId)
    : null;
  const safeCapacityKg = selectedVehicle
    ? selectedVehicle.capacityKg * 0.95
    : null;

  function selectOrders(ids) {
    const weight = orders
      .filter((order) => ids.includes(order.id))
      .reduce((total, order) => total + order.weightKg, 0);
    const suggestions = vehicles
      .filter((vehicle) => vehicle.capacityKg * 0.95 >= weight)
      .sort((left, right) => left.capacityKg - right.capacityKg);
    setSelectedOrderIds(ids);
    setSelectedVehicleId(suggestions[0]?.id ?? "");
  }

  return (
    <ResourcePage
      title="Planificación de rutas"
      description="Optimiza hasta 50 pedidos y visualiza la secuencia geográfica calculada."
      {...resource}
      error={resource.error || optionsError}
      actionLabel="Planificar nueva ruta"
      onAction={() => {
        setSelectedOrderIds([]);
        setSelectedVehicleId("");
        setOptionsError("");
        setDialog({ type: "route" });
      }}
    >
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
              <TableCell>{formatDateTime(route.startsAt)}</TableCell>
              <TableCell>{formatDateTime(route.endsAt)}</TableCell>
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
                {!route.optimized && route.status === "PLANNED" && (
                  <Button
                    variant="contained"
                    disabled={!orders.length || !route.driverId}
                    onClick={() => {
                      setSelectedOrderIds([]);
                      setSelectedVehicleId(route.vehicleId);
                      setOptionsError("");
                      setDialog({ type: "optimization", ...route });
                    }}
                  >
                    Optimizar
                  </Button>
                )}
                <Button onClick={() => setDialog({ type: "driver", ...route })}>
                  {route.driverId ? "Reasignar" : "Asignar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RouteMap
        route={mappedRoute}
        stops={stops}
        navigation={navigation}
        loading={mapLoading}
      />
      {dialog?.type === "route" && (
        <FormDialog
          open
          title="Nueva ruta operativa"
          onClose={() => setDialog(null)}
          onSubmit={createRoute}
          submitting={submitting}
        >
          {optionsError && <Alert severity="error">{optionsError}</Alert>}
          <Alert severity="info">
            Complete el horario, conductor y pedidos. El sistema recomendará
            automáticamente el vehículo y generará la ruta optimizada.
          </Alert>
          <FormControl required fullWidth>
            <InputLabel id="new-route-orders-label">Pedidos</InputLabel>
            <Select
              labelId="new-route-orders-label"
              label="Pedidos"
              multiple
              value={selectedOrderIds}
              onChange={(event) => selectOrders(event.target.value)}
              renderValue={(values) =>
                `${values.length} pedido${values.length === 1 ? "" : "s"}`
              }
            >
              {orders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  <Checkbox checked={selectedOrderIds.includes(order.id)} />
                  <ListItemText
                    primary={order.productName}
                    secondary={`${order.address} · ${order.weightKg} kg · ${formatTime(order.windowStart)}-${formatTime(order.windowEnd)}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {!!selectedOrderIds.length && !!eligibleVehicles.length && (
            <TextField
              select
              label="Vehículo recomendado"
              value={selectedVehicleId}
              onChange={(event) => setSelectedVehicleId(event.target.value)}
              required
            >
              {eligibleVehicles.map((vehicle, index) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {index === 0 ? "Recomendado · " : ""}
                  {vehicle.plate} · {(vehicle.capacityKg * 0.95).toFixed(2)} kg
                  útiles
                </MenuItem>
              ))}
            </TextField>
          )}
          {!!selectedOrderIds.length && !eligibleVehicles.length && (
            <Alert severity="error">
              No hay unidades que soporten {selectedWeightKg.toFixed(2)} kg.
            </Alert>
          )}
          <TextField
            name="driverId"
            label="Conductor"
            select
            required
            defaultValue=""
          >
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {driver.name}
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
          <Alert severity="success">
            La ruta saldrá del local de despacho (-12.07201013486951,
            -75.20516872975998).
          </Alert>
          <Alert severity="info">
            <strong>{dialog.vehiclePlate}</strong> · {dialog.driverName}
          </Alert>
          <TextField
            name="startsAt"
            label="Hora de salida"
            type="datetime-local"
            required
            defaultValue={toLocalDateTimeInput(dialog.startsAt)}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText="Ajústela para que coincida con las ventanas de los pedidos."
          />
          <FormControl required fullWidth>
            <InputLabel id="orders-label">Pedidos pendientes</InputLabel>
            <Select
              labelId="orders-label"
              label="Pedidos pendientes"
              multiple
              value={selectedOrderIds}
              onChange={(event) => selectOrders(event.target.value)}
              renderValue={(values) =>
                `${values.length} pedido${values.length === 1 ? "" : "s"} seleccionado${values.length === 1 ? "" : "s"}`
              }
            >
              {orders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  <Checkbox checked={selectedOrderIds.includes(order.id)} />
                  <ListItemText
                    primary={`${order.priority === "HIGH" ? "Alta · " : ""}${order.productName}`}
                    secondary={`${order.address} · ${order.weightKg} kg · ${formatTime(order.windowStart)}-${formatTime(order.windowEnd)}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedOrderIds.length > 0 && eligibleVehicles.length > 0 && (
            <TextField
              select
              label="Vehículo sugerido"
              value={selectedVehicleId}
              onChange={(event) => setSelectedVehicleId(event.target.value)}
              helperText="Se recomienda la unidad activa de menor capacidad suficiente para aprovechar mejor la flota."
            >
              {eligibleVehicles.map((vehicle, index) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {index === 0 ? "Recomendado · " : ""}
                  {vehicle.plate} · {vehicle.capacityKg.toFixed(2)} kg nominales
                  · {(vehicle.capacityKg * 0.95 - selectedWeightKg).toFixed(2)}{" "}
                  kg libres
                </MenuItem>
              ))}
            </TextField>
          )}
          {selectedOrderIds.length > 0 && !eligibleVehicles.length && (
            <Alert severity="error">
              No hay unidades activas que cumplan la capacidad requerida de{" "}
              {selectedWeightKg.toFixed(2)} kg. Registre una unidad adecuada,
              reduzca el lote o reprograme los pedidos.
            </Alert>
          )}
          {safeCapacityKg !== null && (
            <Alert
              severity={selectedWeightKg > safeCapacityKg ? "error" : "info"}
            >
              Peso seleccionado: {selectedWeightKg.toFixed(2)} kg · capacidad
              segura de {dialog.vehiclePlate}: {safeCapacityKg.toFixed(2)} kg
            </Alert>
          )}
          <Alert severity="info">
            Se respetará el 95 % de capacidad operativa, la prioridad, las
            ventanas de entrega y la jornada máxima de 8 horas. Si un pedido no
            es factible, no se asignará ninguno.
          </Alert>
        </FormDialog>
      )}
    </ResourcePage>
  );
}
