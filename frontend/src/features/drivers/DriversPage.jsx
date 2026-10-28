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

const emptyDriver = { name: "", email: "", password: "", status: "ACTIVE" };

export default function DriversPage() {
  const { session } = useAuth();
  const resource = useApiResource("/drivers");
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = session.user.role === "ADMIN";

  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.password) delete values.password;
    setSubmitting(true);
    try {
      await resource.mutate(
        editing.id ? "PATCH" : "POST",
        editing.id ? `/${editing.id}` : "",
        values,
      );
      setEditing(null);
    } catch {
      /* El hook presenta el error seguro de la API. */
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(driver) {
    if (!globalThis.confirm(`¿Desactivar al conductor ${driver.name}?`)) return;
    await resource.mutate("DELETE", `/${driver.id}`).catch(() => {});
  }

  return (
    <ResourcePage
      title="Conductores"
      description="Personal habilitado para la asignación de rutas."
      {...resource}
      actionLabel={isAdmin ? "Nuevo conductor" : undefined}
      onAction={() => setEditing({ ...emptyDriver })}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell />
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
              <TableCell>
                {isAdmin && (
                  <>
                    <Button onClick={() => setEditing({ ...driver })}>
                      Editar
                    </Button>
                    {driver.status === "ACTIVE" && (
                      <Button color="error" onClick={() => remove(driver)}>
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
          title={editing.id ? "Editar conductor" : "Nuevo conductor"}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          submitting={submitting}
        >
          <TextField
            name="name"
            label="Nombre completo"
            placeholder="María Quispe Huamán"
            defaultValue={editing.name}
            required
            slotProps={{ htmlInput: { minLength: 3, maxLength: 120 } }}
          />
          <TextField
            name="email"
            label="Correo electrónico"
            placeholder="maria.quispe@wanka.local"
            type="email"
            defaultValue={editing.email}
            required
          />
          <TextField
            name="password"
            label={
              editing.id ? "Nueva contraseña (opcional)" : "Contraseña temporal"
            }
            placeholder={
              editing.id
                ? "Déjela vacía para no cambiarla"
                : "Mínimo 12 caracteres"
            }
            type="password"
            required={!editing.id}
            helperText={
              editing.id
                ? "Déjela vacía para conservar la actual."
                : "Mínimo 12 caracteres; entréguela por un canal seguro."
            }
            slotProps={{ htmlInput: { minLength: 12, maxLength: 128 } }}
          />
          {editing.id && (
            <TextField
              name="status"
              label="Estado"
              select
              defaultValue={editing.status}
              helperText="Inactivo no puede recibir rutas nuevas."
            >
              <MenuItem value="ACTIVE">Disponible</MenuItem>
              <MenuItem value="INACTIVE">Inactivo</MenuItem>
            </TextField>
          )}
        </FormDialog>
      )}
    </ResourcePage>
  );
}
