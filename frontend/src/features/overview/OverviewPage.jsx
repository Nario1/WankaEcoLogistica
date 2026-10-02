import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const capabilities = [
  [
    "Pedidos",
    "Registra direcciones, coordenadas, peso, prioridad y ventanas de entrega.",
  ],
  [
    "Vehículos",
    "Administra capacidad, consumo, factor de emisión y disponibilidad.",
  ],
  [
    "Conductores",
    "Registra personal y evita asignaciones con conflictos de horario.",
  ],
  [
    "Seguridad",
    "Autenticación, roles y bloqueo temporal protegen cada operación.",
  ],
];

export default function OverviewPage() {
  return (
    <Grid container spacing={2} sx={{ width: "100%", maxWidth: 1700 }}>
      <Grid size={12}>
        <Typography component="h1" variant="h5" fontWeight={700}>
          Operación logística
        </Typography>
        <Typography color="text.secondary">
          Incremento funcional correspondiente al Sprint 1.
        </Typography>
      </Grid>
      <Grid size={12}>
        <Alert severity="info">
          La optimización automática de rutas, mapas y reportes corresponden a
          próximos sprints.
        </Alert>
      </Grid>
      {capabilities.map(([title, description]) => (
        <Grid key={title} size={{ xs: 12, sm: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">{title}</Typography>
              <Typography color="text.secondary">{description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
