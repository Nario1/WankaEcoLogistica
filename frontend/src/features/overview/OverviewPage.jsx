import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const capabilities = [
  [
    "Pedidos",
    "Registra entregas y selecciona su ubicación directamente en el mapa.",
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
    "Rutas optimizadas",
    "Ordena hasta 50 pedidos por capacidad, prioridad y ventanas, y muestra la secuencia en OpenStreetMap.",
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
          Gestión y planificación visual correspondientes a los Sprints 1 y 2.
        </Typography>
      </Grid>
      <Grid size={12}>
        <Alert severity="info">
          Flujo recomendado: registre vehículos y conductores, ubique los
          pedidos en el mapa y optimice la jornada desde Planificación de rutas.
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
