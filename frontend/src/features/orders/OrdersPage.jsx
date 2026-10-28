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
import ConfirmDialog from "../shared/ConfirmDialog";
import ResourcePage from "../shared/ResourcePage";
import { useApiResource } from "../shared/useApiResource";
import LocationPicker from "./LocationPicker";
import { formatTime } from "../../utils/format";
import Time12Field from "../shared/Time12Field";
import {
  addressInput,
  numberInput,
  productInput,
} from "../shared/fieldRules";

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
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const close = () => setEditing(null);
  const updateField = (field) => (event) =>
    setEditing((current) => ({ ...current, [field]: event.target.value }));
  const updateLocation = (latitude, longitude) =>
    setEditing((current) => ({
      ...current,
      latitude:
        latitude == null || latitude === "" ? "" : Number(latitude).toFixed(6),
      longitude:
        longitude == null || longitude === ""
          ? ""
          : Number(longitude).toFixed(6),
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
                  {order.status === "PENDING" && (
                    <Button color="error" onClick={() => setPendingRemoval(order)}>
                      Eliminar
                    </Button>
                  )}
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
            placeholder="4 cajas de productos de limpieza"
            value={editing.productName}
            onChange={updateField("productName")}
            required
            slotProps={{ htmlInput: productInput }}
          />
          <TextField
            name="address"
            label="Dirección o referencia"
            placeholder="Av. Ferrocarril 123, Huancayo"
            value={editing.address}
            onChange={updateField("address")}
            required
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
              placeholder="-12.065100"
              type="number"
              value={editing.latitude}
              onChange={updateField("latitude")}
              required
              fullWidth
              slotProps={{
                htmlInput: numberInput({
                  min: -90,
                  max: 90,
                  maxDecimals: 6,
              name="longitude"
              label="Longitud"
              placeholder="-75.204900"
              type="number"
              value={editing.longitude}
              onChange={updateField("longitude")}
              required
              fullWidth
              helperText="Coordenada oeste de Huancayo, alrededor de -75.20."
              slotProps={{ htmlInput: { min: -180, max: 180, step: "any" } }}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              slotProps={{
                htmlInput: numberInput({
                  min: -180,
                  max: 180,
                  maxDecimals: 6,
                  title: "La longitud va de -180 a 180",
                  allowNegative: true,
                }),
            />
            <TextField
              name="priority"
              label="Prioridad"
              select
              value={editing.priority}
              onChange={updateField("priority")}
              fullWidth
              helperText="Alta se atiende antes que una entrega normal."
            >
              <MenuItem value="NORMAL">Normal</MenuItem>
              <MenuItem value="HIGH">Alta</MenuItem>
            </TextField>
              slotProps={{
                htmlInput: numberInput({
                  min: 0.01,
                  max: 100000,
                  title: "El peso va de 0.01 a 100000 kg",
                }),
              }}
            <input
              type="hidden"
              name="windowStart"
              value={editing.windowStart}
            />
            <Time12Field
              label="Inicio"
              value={editing.windowStart}
                setEditing((current) => ({ ...current, windowStart: value }))
              }
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <input type="hidden" name="windowEnd" value={editing.windowEnd} />
            <Time12Field
              label="Fin"
              value={editing.windowEnd}
              onChange={(value) =>
                setEditing((current) => ({ ...current, windowEnd: value }))
              }
            />
          </Stack>
        </FormDialog>
      )}
    </ResourcePage>
  );
}
