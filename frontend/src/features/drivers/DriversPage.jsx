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
import {
  emailInput,
  passwordInput,
  personNameInput,
} from "../shared/fieldRules";

const emptyDriver = { name: "", email: "", password: "", status: "ACTIVE" };

export default function DriversPage() {
  const { session } = useAuth();
  const resource = useApiResource("/drivers");
  const [editing, setEditing] = useState(null);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [removing, setRemoving] = useState(false);
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
                      <Button color="error" onClick={() => setPendingRemoval(driver)}>
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
            slotProps={{ htmlInput: personNameInput }}
          />
          <TextField
            name="email"
            label="Correo electrónico"
            placeholder="maria.quispe@wanka.local"
            type="email"
            defaultValue={editing.email}
            required
            slotProps={{ htmlInput: emailInput }}
          />
          <TextField
            name="password"
            label={
              editing.id ? "Nueva contraseña (opcional)" : "Contraseña temporal"
            }
            placeholder={
              editing.id
                ? "Déjela vacía para no cambiarla"
                : "Mínimo 12 caracteres, con letras y números"
            }
            type="password"
            required={!editing.id}
            slotProps={{ htmlInput: passwordInput }}
          />
          {editing.id && (
            <TextField
              name="status"
              label="Estado"
              select
              defaultValue={editing.status}
            >
              <MenuItem value="ACTIVE">Disponible</MenuItem>
              <MenuItem value="INACTIVE">Inactivo</MenuItem>
            </TextField>
          )}
        </FormDialog>
      )}
      <ConfirmDialog
        open={Boolean(pendingRemoval)}
        title="Eliminar conductor"
        message={
          pendingRemoval
            ? `Se desactivará al conductor ${pendingRemoval.name}.`
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
