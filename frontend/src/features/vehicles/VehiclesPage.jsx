import { useState } from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../auth/AuthContext";
import FormDialog from "../shared/FormDialog";
import ResourcePage from "../shared/ResourcePage";
import { useApiResource } from "../shared/useApiResource";

const emptyVehicle = {
  plate: "",
  capacityKg: "",
  consumptionPerKm: "",
  emissionFactor: "",
  status: "ACTIVE",
};

export default function VehiclesPage() {
  const { session } = useAuth();
  const resource = useApiResource("/vehicles");
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = session.user.role === "ADMIN";
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const body = {
      ...values,
      capacityKg: Number(values.capacityKg),
      consumptionPerKm: Number(values.consumptionPerKm),
      emissionFactor: Number(values.emissionFactor),
    };
    setSubmitting(true);
    try {
      await resource.mutate(
        editing.id ? "PATCH" : "POST",
        editing.id ? `/${editing.id}` : "",
        body,
      );
      setEditing(null);
    } catch {
      /* El hook presenta el error seguro de la API. */
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <ResourcePage
      title="Vehículos"
      description="Capacidad, consumo, emisiones y disponibilidad de la flota."
      {...resource}
      actionLabel={isAdmin ? "Nuevo vehículo" : undefined}
      onAction={() => setEditing(emptyVehicle)}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Placa</TableCell>
            <TableCell>Capacidad</TableCell>
            <TableCell>Consumo/km</TableCell>
            <TableCell>Factor emisión</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {resource.items.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.plate}</TableCell>
              <TableCell>{vehicle.capacityKg} kg</TableCell>
              <TableCell>{vehicle.consumptionPerKm}</TableCell>
              <TableCell>{vehicle.emissionFactor}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={vehicle.status === "ACTIVE" ? "success" : "default"}
                  label={
                    vehicle.status === "ACTIVE"
                      ? "Disponible"
                      : "Fuera de servicio"
                  }
                />
              </TableCell>
              <TableCell>
                {isAdmin && (
                  <Button onClick={() => setEditing(vehicle)}>Editar</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editing && (
        <FormDialog
          open
          title={editing.id ? "Editar vehículo" : "Nuevo vehículo"}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          submitting={submitting}
        >
          <TextField
            name="plate"
            label="Placa"
            defaultValue={editing.plate}
            required
            helperText="De 5 a 10 caracteres: letras, números y guiones."
            inputProps={{
              minLength: 5,
              maxLength: 10,
              pattern: "[A-Za-z0-9-]+",
            }}
          />
          <TextField
            name="capacityKg"
            label="Capacidad (kg)"
            type="number"
            defaultValue={editing.capacityKg}
            required
            inputProps={{ min: 0.01, step: 0.01 }}
          />
          <TextField
            name="consumptionPerKm"
            label="Consumo por km"
            type="number"
            defaultValue={editing.consumptionPerKm}
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            name="emissionFactor"
            label="Factor de emisión"
            type="number"
            defaultValue={editing.emissionFactor}
            required
            inputProps={{ min: 0, step: 0.0001 }}
          />
          <TextField
            name="status"
            label="Estado"
            select
            defaultValue={editing.status}
          >
            <MenuItem value="ACTIVE">Disponible</MenuItem>
            <MenuItem value="OUT_OF_SERVICE">Fuera de servicio</MenuItem>
          </TextField>
        </FormDialog>
      )}
    </ResourcePage>
  );
}
