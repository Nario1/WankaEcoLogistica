import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { apiRequest, formatApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import FormDialog from "../shared/FormDialog";
import ResourcePage from "../shared/ResourcePage";
import RowMenu from "../shared/RowMenu";
import { useApiResource } from "../shared/useApiResource";
import RouteMap from "./RouteMap";
import { formatDateTime, formatTime } from "../../utils/format";
import DateTime12Field from "../shared/DateTime12Field";

function DateTimeCell({ value }) {
  const [date, time = ""] = formatDateTime(value)
    .replace(/:\d{2}(?=\s?[AP]M)/, "")
    .split(", ");
  return (
    <TableCell>
      <Box sx={{ whiteSpace: "nowrap", lineHeight: 1.3 }}>{date}</Box>
      <Box
        sx={{ whiteSpace: "nowrap", lineHeight: 1.3, color: "text.secondary" }}
      >
        {time}
      </Box>
    </TableCell>
  );
}

function OrderPicker({
  labelId,
  label,
  orders,
  selectedIds,
  onChange,
  showPriority = false,
}) {
  const [open, setOpen] = useState(false);
  const count = selectedIds.length;

  return (
    <FormControl required fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        multiple
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={selectedIds}
        onChange={(event) => onChange(event.target.value)}
        renderValue={() =>
          count
            ? `${count} pedido${count === 1 ? "" : "s"} seleccionado${count === 1 ? "" : "s"}`
            : ""
        }
        MenuProps={{
          slotProps: {
            paper: { sx: { maxHeight: 420 } },
          },
        }}
      >
        {orders.map((order) => (
          <MenuItem key={order.id} value={order.id}>
            <Checkbox checked={selectedIds.includes(order.id)} />
            <ListItemText
              primary={`${showPriority && order.priority === "HIGH" ? "Alta · " : ""}${order.productName}`}
              secondary={`${order.address} · ${order.weightKg} kg · ${formatTime(order.windowStart)}-${formatTime(order.windowEnd)}`}
            />
          </MenuItem>
        ))}
        <ListSubheader
          component="div"
          disableSticky
          sx={{
            position: "sticky",
            bottom: 0,
            top: "auto",
            zIndex: 1,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            lineHeight: "normal",
            py: 1,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
            }}
          >
            Continuar
          </Button>
        </ListSubheader>
      </Select>
      <FormHelperText>
        Marque los pedidos y pulse Continuar para cerrar la lista.
      </FormHelperText>
    </FormControl>
  );
}

function toLocalDateTimeInput(value) {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function todayAt(hour) {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return `${local.toISOString().slice(0, 10)}T${String(hour).padStart(2, "0")}:00`;
}

function suggestSchedule(selectedOrders) {
  if (!selectedOrders.length) {
    return { startsAt: todayAt(8), endsAt: todayAt(16) };
  }
  const toMinutes = (value) => {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
  };
  const earliest = Math.min(
    ...selectedOrders.map((order) => toMinutes(order.windowStart)),
  );
  const latest = Math.max(
    ...selectedOrders.map((order) => toMinutes(order.windowEnd)),
  );
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const planningDate = new Date(now);
  if (currentMinutes >= earliest)
    planningDate.setDate(planningDate.getDate() + 1);
  const localDate = new Date(
    planningDate.getTime() - planningDate.getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 10);
  const format = (minutes) =>
    `${localDate}T${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  const end = Math.min(latest, earliest + 8 * 60);
  return {
    startsAt: format(earliest),
    endsAt: format(Math.max(earliest + 1, end)),
  };
}

export default function RoutesPage() {
  const { session, logout } = useAuth();
  const resource = useApiResource("/routes");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [suggestedSchedule, setSuggestedSchedule] = useState(() =>
    suggestSchedule([]),
  );
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

  async function updateRoute(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    await submitResource("PATCH", `/${dialog.id}`, {
      vehicleId: values.vehicleId,
      startsAt: new Date(values.startsAt).toISOString(),
      endsAt: new Date(values.endsAt).toISOString(),
      status: values.status,
    }).catch(() => {});
  }

  async function removeRoute(route) {
    if (
      !globalThis.confirm(
        `¿Cancelar la ruta del vehículo ${route.vehiclePlate}?`,
      )
    )
      return;
    await resource.mutate("DELETE", `/${route.id}`).catch(() => {});
    if (mappedRoute?.id === route.id) {
      setMappedRoute(null);
      setStops([]);
      setNavigation(null);
    }
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
    const selected = orders.filter((order) => ids.includes(order.id));
    const weight = orders
      .filter((order) => ids.includes(order.id))
      .reduce((total, order) => total + order.weightKg, 0);
    const suggestions = vehicles
      .filter((vehicle) => vehicle.capacityKg * 0.95 >= weight)
      .sort((left, right) => left.capacityKg - right.capacityKg);
    setSelectedOrderIds(ids);
    setSelectedVehicleId(suggestions[0]?.id ?? "");
    setSuggestedSchedule(suggestSchedule(selected));
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
        setSuggestedSchedule(suggestSchedule([]));
        setOptionsError("");
        setDialog({ type: "route" });
      }}
    >
      {!orders.length && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay pedidos pendientes disponibles para optimizar.
        </Alert>
      )}
      <Table size="small" sx={{ width: "100%", tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "12%" }}>Vehículo</TableCell>
            <TableCell sx={{ width: "12%" }}>Inicio</TableCell>
            <TableCell sx={{ width: "12%" }}>Fin</TableCell>
            <TableCell sx={{ width: "16%" }}>Conductor</TableCell>
            <TableCell sx={{ width: "14%" }}>Resultado</TableCell>
            <TableCell align="right" sx={{ width: "34%" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resource.items.map((route) => {
            const driverName = route.driverName ?? "Sin asignar";
            return (
            <TableRow key={route.id} selected={mappedRoute?.id === route.id}>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {route.vehiclePlate}
              </TableCell>
              <DateTimeCell value={route.startsAt} />
              <DateTimeCell value={route.endsAt} />
              <TableCell>
                <Box title={driverName} sx={{ lineHeight: 1.3 }}>
                  {driverName}
                </Box>
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {route.optimized
                  ? `${route.distanceKm ?? 0} km / ${route.totalWeightKg ?? 0} kg`
                  : "Manual"}
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    width: "100%",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: "1 1 0", minWidth: 0, display: "flex" }}>
                    {route.optimized && (
                      <Button
                        fullWidth
                        size="small"
                        sx={{ px: 1 }}
                        onClick={() => showRoute(route)}
                      >
                        Ver mapa
                      </Button>
                    )}
                    {!route.optimized && route.status === "PLANNED" && (
                      <Tooltip
                        title={
                          route.driverId
                            ? "Calcular la ruta con los pedidos pendientes"
                            : "Asigne un conductor para poder optimizar"
                        }
                      >
                        <Box component="span" sx={{ display: "block", width: "100%" }}>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ px: 1 }}
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
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                  <Box sx={{ flex: "1 1 0", minWidth: 0, display: "flex" }}>
                    <Button
                      fullWidth
                      size="small"
                      sx={{ px: 1 }}
                      onClick={() => setDialog({ type: "driver", ...route })}
                    >
                      {route.driverId ? "Reasignar" : "Asignar"}
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      width: 36,
                      flex: "0 0 36px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <RowMenu
                      items={
                        route.status === "CANCELLED" ||
                        route.status === "COMPLETED"
                          ? []
                          : [
                              {
                                label: "Editar",
                                onClick: () =>
                                  setDialog({ type: "edit", ...route }),
                              },
                              {
                                label: "Eliminar",
                                danger: true,
                                onClick: () => removeRoute(route),
                              },
                            ]
                      }
                    />
                  </Box>
                </Stack>
              </TableCell>
            </TableRow>
            );
          })}
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
          <OrderPicker
            labelId="new-route-orders-label"
            label="Pedidos"
            orders={orders}
            selectedIds={selectedOrderIds}
            onChange={selectOrders}
          />
          {!!selectedOrderIds.length && !!eligibleVehicles.length && (
            <TextField
              select
              label="Vehículo recomendado"
              value={selectedVehicleId}
              onChange={(event) => setSelectedVehicleId(event.target.value)}
              required
              helperText="La primera opción es la unidad más pequeña que alcanza para la carga."
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
            helperText="Persona que realizará las entregas de esta ruta."
          >
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {driver.name}
              </MenuItem>
            ))}
          </TextField>
          <DateTime12Field
            key={`start-${suggestedSchedule.startsAt}`}
            name="startsAt"
            label="Inicio"
            defaultValue={suggestedSchedule.startsAt}
          />
          <DateTime12Field
            key={`end-${suggestedSchedule.endsAt}`}
            name="endsAt"
            label="Fin (máximo 8 horas)"
            defaultValue={suggestedSchedule.endsAt}
          />
          {!!selectedOrderIds.length && (
            <Alert severity="success">
              Horario sugerido según las ventanas de los pedidos seleccionados.
              Inicio: {formatDateTime(suggestedSchedule.startsAt)} · fin:{" "}
              {formatDateTime(suggestedSchedule.endsAt)}. Puede ajustarlo antes
              de confirmar.
            </Alert>
          )}
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
            helperText="Elija quién se hará cargo de esta ruta."
          >
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {driver.name}
              </MenuItem>
            ))}
          </TextField>
        </FormDialog>
      )}
      {dialog?.type === "edit" && (
        <FormDialog
          open
          title="Editar ruta"
          onClose={() => setDialog(null)}
          onSubmit={updateRoute}
          submitting={submitting}
        >
          <TextField
            name="vehicleId"
            label="Vehículo"
            select
            required
            defaultValue={dialog.vehicleId}
          >
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.id} value={vehicle.id}>
                {vehicle.plate} · {vehicle.capacityKg} kg
              </MenuItem>
            ))}
          </TextField>
          <DateTime12Field
            name="startsAt"
            label="Inicio"
            defaultValue={toLocalDateTimeInput(dialog.startsAt)}
          />
          <DateTime12Field
            name="endsAt"
            label="Fin (máximo 8 horas)"
            defaultValue={toLocalDateTimeInput(dialog.endsAt)}
          />
          <TextField
            name="status"
            label="Estado"
            select
            defaultValue={dialog.status}
            helperText="En curso y completada reflejan el avance en campo."
          >
            <MenuItem value="PLANNED">Planificada</MenuItem>
            <MenuItem value="IN_PROGRESS">En curso</MenuItem>
            <MenuItem value="COMPLETED">Completada</MenuItem>
            <MenuItem value="CANCELLED">Cancelada</MenuItem>
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
          <DateTime12Field
            key={`optimization-${suggestedSchedule.startsAt}`}
            name="startsAt"
            label="Salida"
            defaultValue={
              selectedOrderIds.length
                ? suggestedSchedule.startsAt
                : toLocalDateTimeInput(dialog.startsAt)
            }
          />
          <OrderPicker
            labelId="orders-label"
            label="Pedidos pendientes"
            orders={orders}
            selectedIds={selectedOrderIds}
            onChange={selectOrders}
            showPriority
          />
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
