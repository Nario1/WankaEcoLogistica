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
import ConfirmDialog from "../shared/ConfirmDialog";
import ResourcePage from "../shared/ResourcePage";
import { useApiResource } from "../shared/useApiResource";
import { numberInput, plateInput } from "../shared/fieldRules";

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
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [removing, setRemoving] = useState(false);
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
  async function confirmRemoval() {
    if (!pendingRemoval) return;
    setRemoving(true);
    try {
      await resource.mutate("DELETE", `/${pendingRemoval.id}`);
      setPendingRemoval(null);
    } catch {
      /* El hook presenta el error seguro de la API. */
    } finally {
      setRemoving(false);
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
                  <>
                    <Button onClick={() => setEditing(vehicle)}>Editar</Button>
                    {vehicle.status === "ACTIVE" && (
                      <Button color="error" onClick={() => setPendingRemoval(vehicle)}>
                        Eliminar
                      </Button>
                    )}
                  </>
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
            placeholder="T123456"
            defaultValue={editing.plate}
            required
            slotProps={{ htmlInput: plateInput }}
          />
          <TextField
            name="capacityKg"
            label="Capacidad (kg)"
            placeholder="1000"
            type="number"
            defaultValue={editing.capacityKg}
            required
            slotProps={{
              htmlInput: numberInput({
                min: 0.01,
                max: 100000,
                title: "La capacidad va de 0.01 a 100000 kg",
              }),
            }}
          />
          <TextField
            name="consumptionPerKm"
            label="Consumo por km"
            placeholder="0.12"
            type="number"
            defaultValue={editing.consumptionPerKm}
            required
            slotProps={{
              htmlInput: numberInput({
                min: 0,
                max: 5,
                title: "El consumo va de 0 a 5 litros por km",
              }),
            }}
          />
          <TextField
            name="emissionFactor"
            label="Factor de emisión"
            placeholder="2.68"
            type="number"
            defaultValue={editing.emissionFactor}
            required
            slotProps={{
              htmlInput: numberInput({
                min: 0,
                max: 20,
                title: "El factor de emisión va de 0 a 20",
              }),
            }}
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
      <ConfirmDialog
        open={Boolean(pendingRemoval)}
        title="Eliminar vehículo"
        message={
          pendingRemoval
            ? `Se dará de baja el vehículo ${pendingRemoval.plate}.`
            : ""
        }
        confirmLabel="Eliminar"
        confirming={removing}
        onClose={() => setPendingRemoval(null)}
        onConfirm={confirmRemoval}
      />
    </ResourcePage>
  );
}
