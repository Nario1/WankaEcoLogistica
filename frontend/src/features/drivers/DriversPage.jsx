import { useState } from "react";
import Chip from "@mui/material/Chip";
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

export default function DriversPage() {
  const { session } = useAuth();
  const resource = useApiResource("/drivers");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = session.user.role === "ADMIN";
  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await resource.mutate(
        "POST",
        "",
        Object.fromEntries(new FormData(event.currentTarget)),
      );
      setOpen(false);
    } catch {
      /* El hook presenta el error seguro de la API. */
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <ResourcePage
      title="Conductores"
      description="Personal habilitado para la asignación de rutas."
      {...resource}
      actionLabel={isAdmin ? "Nuevo conductor" : undefined}
      onAction={() => setOpen(true)}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resource.items.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>{driver.name}</TableCell>
              <TableCell>{driver.email}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={driver.status === "ACTIVE" ? "success" : "default"}
                  label={driver.status === "ACTIVE" ? "Disponible" : "Inactivo"}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FormDialog
        open={open}
        title="Nuevo conductor"
        onClose={() => setOpen(false)}
        onSubmit={submit}
        submitting={submitting}
      >
        <TextField
          name="name"
          label="Nombre completo"
          required
          inputProps={{ minLength: 3, maxLength: 120 }}
        />
        <TextField
          name="email"
          label="Correo electrónico"
          type="email"
          required
        />
        <TextField
          name="password"
          label="Contraseña temporal"
          type="password"
          required
          helperText="Mínimo 12 caracteres; entréguela por un canal seguro."
          inputProps={{ minLength: 12, maxLength: 128 }}
        />
      </FormDialog>
    </ResourcePage>
  );
}
