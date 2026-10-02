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
  const [optionsError, setOptionsError] = useState("");
  const [dialog, setDialog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      apiRequest("/vehicles", { token: session.token }),
      apiRequest("/drivers", { token: session.token }),
    ])
      .then(([vehicleData, driverData]) => {
        setVehicles(
          vehicleData.filter((vehicle) => vehicle.status === "ACTIVE"),
        );
        setDrivers(driverData.filter((driver) => driver.status === "ACTIVE"));
      })
      .catch((requestError) => {
        if (requestError.status === 401) {
          logout();
          return;
        }
        setOptionsError(formatApiError(requestError));
      });
  }, [logout, session.token]);

  async function createRoute(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    values.startsAt = new Date(values.startsAt).toISOString();
    values.endsAt = new Date(values.endsAt).toISOString();
    setSubmitting(true);
    try {
      await resource.mutate("POST", "", values);
      setDialog(null);
    } catch {
      /* El hook presenta el error seguro de la API. */
    } finally {
      setSubmitting(false);
    }
  }

  async function assignDriver(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setSubmitting(true);
    try {
      await resource.mutate("PUT", `/${dialog.id}/driver`, values);
      setDialog(null);
    } catch {
      /* El hook presenta el error seguro de la API. */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ResourcePage
      title="Asignación de conductores"
      description="Rutas operativas manuales del Sprint 1; la optimización pertenece al siguiente incremento."
      {...resource}
      error={resource.error || optionsError}
      actionLabel="Nueva ruta operativa"
      onAction={() => setDialog({ type: "route" })}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Vehículo</TableCell>
            <TableCell>Inicio</TableCell>
            <TableCell>Fin</TableCell>
            <TableCell>Conductor</TableCell>
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
    </ResourcePage>
  );
}
