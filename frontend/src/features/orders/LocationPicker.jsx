import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HUANCAYO_CENTER = [-12.0651, -75.2049];

function MapController({ position, onSelect }) {
  const map = useMap();
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });
  useEffect(() => {
    if (position) map.flyTo(position, Math.max(map.getZoom(), 15));
  }, [map, position]);
  return null;
}

MapController.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  onSelect: PropTypes.func.isRequired,
};

export default function LocationPicker({ latitude, longitude, onChange }) {
  const [locationError, setLocationError] = useState("");
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  const hasPosition =
    Number.isFinite(parsedLatitude) &&
    Number.isFinite(parsedLongitude) &&
    parsedLatitude >= -90 &&
    parsedLatitude <= 90 &&
    parsedLongitude >= -180 &&
    parsedLongitude <= 180 &&
    latitude !== "" &&
    longitude !== "";
  const position = hasPosition ? [parsedLatitude, parsedLongitude] : null;

  function useCurrentLocation() {
    setLocationError("");
    if (!globalThis.navigator?.geolocation) {
      setLocationError("El navegador no admite geolocalización.");
      return;
    }
    globalThis.navigator.geolocation.getCurrentPosition(
      ({ coords }) => onChange(coords.latitude, coords.longitude),
      () =>
        setLocationError(
          "No se pudo obtener la ubicación. Permita el acceso o seleccione un punto en el mapa.",
        ),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={1}
        sx={{
          justifyContent: "space-between",
          alignItems: { sm: "center" },
          mb: 1,
        }}
      >
        <Box>
          <Typography fontWeight={600}>Ubicación de entrega</Typography>
          <Typography variant="body2" color="text.secondary">
            Haga clic sobre el mapa para colocar o mover el punto.
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={<MyLocationRoundedIcon />}
          onClick={useCurrentLocation}
        >
          Usar mi ubicación
        </Button>
      </Stack>
      {locationError && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          {locationError}
        </Alert>
      )}
      <Box
        sx={{
          height: 320,
          borderRadius: 2,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
        }}
      >
        <MapContainer
          center={position ?? HUANCAYO_CENTER}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController position={position} onSelect={onChange} />
          {position && (
            <CircleMarker
              center={position}
              radius={11}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#1976d2",
                fillOpacity: 1,
              }}
            />
          )}
        </MapContainer>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {position
          ? `Punto seleccionado: ${parsedLatitude.toFixed(6)}, ${parsedLongitude.toFixed(6)}`
          : "Seleccione un punto para completar las coordenadas."}
      </Typography>
    </Box>
  );
}

LocationPicker.propTypes = {
  latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  onChange: PropTypes.func.isRequired,
};
