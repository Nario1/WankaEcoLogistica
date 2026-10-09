import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import FormDialog from "../shared/FormDialog";
import ResourcePage from "../shared/ResourcePage";
import { useApiResource } from "../shared/useApiResource";
import LocationPicker from "./LocationPicker";
import { formatTime } from "../../utils/format";

const emptyOrder = {
  productName: "",
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
  const updateField = (field) => (event) =>
    setEditing((current) => ({ ...current, [field]: event.target.value }));
  const updateLocation = (latitude, longitude) =>
    setEditing((current) => ({
      ...current,
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
    }));

  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const body = {
      ...values,
      latitude: Number(editing.latitude),
      longitude: Number(editing.longitude),
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
      description="Registre la entrega y seleccione su ubicación directamente en el mapa."
      {...resource}
      actionLabel="Nuevo pedido"
      onAction={() => setEditing({ ...emptyOrder })}
    >
      {!resource.loading && !resource.items.length && (
        <Alert severity="info">
          Aún no hay pedidos. Cree el primero seleccionando su punto de entrega
          en el mapa.
        </Alert>
      )}
      {!!resource.items.length && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto o carga</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Peso</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Ventana</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {resource.items.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.productName}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{ fontFamily: "monospace", fontSize: 12 }}
                  >
                    {Number(order.latitude).toFixed(5)},{" "}
                    {Number(order.longitude).toFixed(5)}
                  </Box>
                </TableCell>
                <TableCell>{order.weightKg} kg</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={order.priority === "HIGH" ? "warning" : "default"}
                    label={order.priority === "HIGH" ? "Alta" : "Normal"}
                  />
                </TableCell>
                <TableCell>
                  {formatTime(order.windowStart)}–{formatTime(order.windowEnd)}
                </TableCell>
                <TableCell>
                  <Button onClick={() => setEditing({ ...order })}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {editing && (
        <FormDialog
          open
          maxWidth="md"
          title={editing.id ? "Editar pedido" : "Nuevo pedido"}
          onClose={close}
          onSubmit={submit}
          submitting={submitting}
        >
          <Alert severity="info">
            Complete los datos y marque con precisión el destino. Esta ubicación
            se utilizará para optimizar la ruta.
          </Alert>
          <TextField
            name="productName"
            label="Producto o carga transportada"
            value={editing.productName}
            onChange={updateField("productName")}
            required
            helperText="Ejemplo: 4 cajas de productos de limpieza"
            slotProps={{ htmlInput: { minLength: 2, maxLength: 160 } }}
          />
          <TextField
            name="address"
            label="Dirección o referencia"
            value={editing.address}
            onChange={updateField("address")}
            required
            helperText="Ejemplo: Av. Ferrocarril 123, Huancayo"
            slotProps={{ htmlInput: { minLength: 5, maxLength: 255 } }}
          />
          <LocationPicker
            latitude={editing.latitude}
            longitude={editing.longitude}
            onChange={updateLocation}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              name="latitude"
              label="Latitud"
              type="number"
              value={editing.latitude}
              onChange={updateField("latitude")}
              required
              fullWidth
              slotProps={{ htmlInput: { min: -90, max: 90, step: "any" } }}
            />
            <TextField
              name="longitude"
              label="Longitud"
              type="number"
              value={editing.longitude}
              onChange={updateField("longitude")}
              required
              fullWidth
              slotProps={{ htmlInput: { min: -180, max: 180, step: "any" } }}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              name="weightKg"
              label="Peso (kg)"
              type="number"
              value={editing.weightKg}
              onChange={updateField("weightKg")}
              required
              fullWidth
              slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
            />
            <TextField
              name="priority"
              label="Prioridad"
              select
              value={editing.priority}
              onChange={updateField("priority")}
              fullWidth
            >
              <MenuItem value="NORMAL">Normal</MenuItem>
              <MenuItem value="HIGH">Alta</MenuItem>
            </TextField>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              name="windowStart"
              label="Inicio de ventana"
              type="time"
              value={editing.windowStart}
              onChange={updateField("windowStart")}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              name="windowEnd"
              label="Fin de ventana"
              type="time"
              value={editing.windowEnd}
              onChange={updateField("windowEnd")}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </FormDialog>
      )}
    </ResourcePage>
  );
}
