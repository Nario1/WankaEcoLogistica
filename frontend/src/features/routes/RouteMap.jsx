import { useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HUANCAYO_CENTER = [-12.0651, -75.2049];
const DISPATCH_DEPOT = {
  name: "Local de despacho",
  latitude: -12.07201013486951,
  longitude: -75.20516872975998,
};

function FitRoute({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 1) map.setView(positions[0], 15);
    if (positions.length > 1) map.fitBounds(positions, { padding: [36, 36] });
  }, [map, positions]);
  return null;
}

FitRoute.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};

export default function RouteMap({ route, stops, loading }) {
  const stopPositions = stops.map((stop) => [stop.latitude, stop.longitude]);
  const depotPosition = [DISPATCH_DEPOT.latitude, DISPATCH_DEPOT.longitude];
  const positions = route ? [depotPosition, ...stopPositions] : [];
  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ mb: 1 }}>
        <Typography variant="h6">Mapa de la ruta optimizada</Typography>
        {route && (
          <Typography color="text.secondary">
            {route.vehiclePlate} · {route.distanceKm ?? 0} km · {stops.length}{" "}
            paradas
          </Typography>
        )}
      </Stack>
      <Box
        sx={{
          height: { xs: 360, md: 480 },
          borderRadius: 2,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
        }}
      >
        <MapContainer
          center={positions[0] ?? HUANCAYO_CENTER}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitRoute positions={positions} />
          {positions.length > 1 && (
            <Polyline
              positions={positions}
              pathOptions={{ color: "#087f5b", weight: 5, opacity: 0.8 }}
            />
          )}
          {route && (
            <CircleMarker
              center={depotPosition}
              radius={15}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#d84315",
                fillOpacity: 1,
              }}
            >
              <Popup>
                <strong>{DISPATCH_DEPOT.name}</strong>
                <br />
                Inicio de todas las rutas
                <br />
                {DISPATCH_DEPOT.latitude}, {DISPATCH_DEPOT.longitude}
              </Popup>
            </CircleMarker>
          )}
          {stops.map((stop, index) => (
            <CircleMarker
              key={stop.id}
              center={stopPositions[index]}
              radius={13}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#087f5b",
                fillOpacity: 1,
              }}
            >
              <Popup>
                <strong>Parada {stop.deliveryOrder}</strong>
                <br />
                {stop.address}
                <br />
                {stop.weightKg} kg · {stop.windowStart}-{stop.windowEnd}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {loading
          ? "Cargando paradas…"
          : route && stops.length
            ? "La línea parte del local y conecta las paradas en el orden calculado; no representa navegación vial giro a giro."
            : "Seleccione una ruta optimizada para visualizar sus paradas."}
      </Typography>
    </Box>
  );
}

RouteMap.propTypes = {
  route: PropTypes.shape({
    vehiclePlate: PropTypes.string,
    distanceKm: PropTypes.number,
  }),
  stops: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      deliveryOrder: PropTypes.number,
      address: PropTypes.string,
      weightKg: PropTypes.number,
      windowStart: PropTypes.string,
      windowEnd: PropTypes.string,
    }),
  ).isRequired,
  loading: PropTypes.bool,
};
