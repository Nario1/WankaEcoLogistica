import { useState } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import FormDialog from "../shared/FormDialog";
import ResourcePage from "../shared/ResourcePage";
import { useApiResource } from "../shared/useApiResource";

const emptyOrder = {
  address: "",
  latitude: "",
  longitude: "",
  weightKg: "",
  priority: "NORMAL",
  windowStart: "08:00",
  windowEnd: "10:00",
};

export default function OrdersPage() {
  const resource = useApiResource("/orders");
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const close = () => setEditing(null);

  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const body = {
      ...values,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      weightKg: Number(values.weightKg),
    };
    setSubmitting(true);
    try {
      await resource.mutate(
        editing.id ? "PATCH" : "POST",
        editing.id ? `/${editing.id}` : "",
        body,
      );
      close();
    } catch {
      /* El hook presenta el error seguro de la API. */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ResourcePage
      title="Pedidos"
      description="Registro y actualización de entregas con datos geográficos válidos."
      {...resource}
      actionLabel="Nuevo pedido"
      onAction={() => setEditing(emptyOrder)}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Dirección</TableCell>
            <TableCell>Coordenadas</TableCell>
            <TableCell>Peso</TableCell>
            <TableCell>Prioridad</TableCell>
            <TableCell>Ventana</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {resource.items.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.address}</TableCell>
              <TableCell>
                {order.latitude}, {order.longitude}
              </TableCell>
              <TableCell>{order.weightKg} kg</TableCell>
              <TableCell>{order.priority}</TableCell>
              <TableCell>
                {order.windowStart}–{order.windowEnd}
              </TableCell>
              <TableCell>
                <Button onClick={() => setEditing(order)}>Editar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editing && (
        <FormDialog
          open
          title={editing.id ? "Editar pedido" : "Nuevo pedido"}
          onClose={close}
          onSubmit={submit}
          submitting={submitting}
        >
          <TextField
            name="address"
            label="Dirección"
            defaultValue={editing.address}
            required
            helperText="Mínimo 5 caracteres."
            inputProps={{ minLength: 5, maxLength: 255 }}
          />
          <TextField
            name="latitude"
            label="Latitud"
            type="number"
            defaultValue={editing.latitude}
            required
            inputProps={{ min: -90, max: 90, step: "any" }}
          />
          <TextField
            name="longitude"
            label="Longitud"
            type="number"
            defaultValue={editing.longitude}
            required
            inputProps={{ min: -180, max: 180, step: "any" }}
          />
          <TextField
            name="weightKg"
            label="Peso (kg)"
            type="number"
            defaultValue={editing.weightKg}
            required
            inputProps={{ min: 0.01, step: 0.01 }}
          />
          <TextField
            name="priority"
            label="Prioridad"
            select
            defaultValue={editing.priority}
          >
            <MenuItem value="NORMAL">Normal</MenuItem>
            <MenuItem value="HIGH">Alta</MenuItem>
          </TextField>
          <TextField
            name="windowStart"
            label="Inicio de ventana"
            type="time"
            defaultValue={editing.windowStart}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="windowEnd"
            label="Fin de ventana"
            type="time"
            defaultValue={editing.windowEnd}
            required
            InputLabelProps={{ shrink: true }}
          />
        </FormDialog>
      )}
    </ResourcePage>
  );
}
