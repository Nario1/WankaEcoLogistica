import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
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

export default function RoutesPage() {
  const { session, logout } = useAuth();
  const resource = useApiResource("/routes");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [optionsError, setOptionsError] = useState("");
  const [dialog, setDialog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
    const values = Object.fromEntries(new FormData(event.currentTarget));
    await submitResource("PUT", `/${dialog.id}/driver`, values).catch(() => {});
  }

  async function optimizeRoute(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const orderIds = formData.getAll("orderIds");
    setSubmitting(true);
    try {
      await apiRequest("/optimizations", {
        token: session.token,
        method: "POST",
        body: JSON.stringify({
          orderIds,
          startsAt: new Date(formData.get("startsAt")).toISOString(),
        }),
      });
      setOrders((current) =>
        current.filter((order) => !orderIds.includes(order.id)),
      );
      await resource.load();
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
      description="Crea rutas manuales u optimiza hasta 50 pedidos respetando capacidad, prioridad y ventanas horarias."
      {...resource}
      error={resource.error || optionsError}
      actionLabel="Nueva ruta manual"
      onAction={() => setDialog({ type: "route" })}
    >
      <Button
        sx={{ mb: 2 }}
        variant="outlined"
        onClick={() => setDialog({ type: "optimization" })}
      >
        Optimizar pedidos
      </Button>
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
            <TableRow key={route.id}>
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
                <Button onClick={() => setDialog({ type: "driver", ...route })}>
                  {route.driverId ? "Reasignar" : "Asignar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="endsAt"
            label="Fin (máximo 8 horas)"
            type="datetime-local"
            required
            InputLabelProps={{ shrink: true }}
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
          <TextField
            name="startsAt"
            label="Inicio de jornada"
            type="datetime-local"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="orderIds"
            label="Pedidos pendientes"
            select
            required
            SelectProps={{ multiple: true }}
            defaultValue={[]}
            helperText="Seleccione entre 1 y 50 pedidos"
          >
            {orders.map((order) => (
              <MenuItem key={order.id} value={order.id}>
                {order.priority === "HIGH" ? "Alta · " : ""}
                {order.address} · {order.weightKg} kg · {order.windowStart}-
                {order.windowEnd}
              </MenuItem>
            ))}
          </TextField>
        </FormDialog>
      )}
    </ResourcePage>
  );
}
