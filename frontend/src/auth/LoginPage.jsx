import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AppTheme from "../shared-theme/AppTheme";
import { formatApiError } from "../api/client";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      await login({ email: data.get("email"), password: data.get("password") });
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <Card component="main" sx={{ width: "100%", maxWidth: 420, p: 4 }}>
          <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
            <Box>
              <Typography component="h1" variant="h4" fontWeight={700}>
                WankaEcoLogística
              </Typography>
              <Typography color="text.secondary">
                Acceso seguro al panel operativo
              </Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              name="email"
              label="Correo electrónico"
              type="email"
              autoComplete="username"
              required
              autoFocus
            />
            <TextField
              name="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              required
              inputProps={{ minLength: 8 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? "Ingresando…" : "Ingresar"}
            </Button>
          </Stack>
        </Card>
      </Box>
    </AppTheme>
  );
}
