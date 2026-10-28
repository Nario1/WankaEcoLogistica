import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DISPATCH_DEPOT } from "../shared/depot";

const HUANCAYO_CENTER = [-12.0651, -75.2049];
const DEPOT = [DISPATCH_DEPOT.latitude, DISPATCH_DEPOT.longitude];

function MapController({ points, onSelect }) {
  const map = useMap();
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });
  const frame = points.map((point) => point.join(",")).join("|");
  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points, { padding: [36, 36], maxZoom: 14 });
    }
  }, [frame, map, points]);
  return null;
}

MapController.propTypes = {
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  onSelect: PropTypes.func.isRequired,
};

function isValidPoint(latitude, longitude) {
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  return (
    latitude !== "" &&
    longitude !== "" &&
    Number.isFinite(parsedLatitude) &&
    Number.isFinite(parsedLongitude) &&
    parsedLatitude >= -90 &&
    parsedLatitude <= 90 &&
    parsedLongitude >= -180 &&
    parsedLongitude <= 180
  );
}

export default function LocationPicker({ latitude, longitude, onChange }) {
  const [locationError, setLocationError] = useState("");
  const [mode, setMode] = useState("depot");
  const [manualStart, setManualStart] = useState(null);
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  const hasPosition = isValidPoint(latitude, longitude);
  const position = hasPosition ? [parsedLatitude, parsedLongitude] : null;
  const manual = mode === "points";
  const line = manual
    ? manualStart && position
      ? [manualStart, position]
      : null
    : position
      ? [DEPOT, position]
      : null;
  const mapPoints = line ?? (manualStart ? [manualStart] : manual ? [] : [DEPOT]);

  function selectPoint(nextLatitude, nextLongitude) {
    if (!manual) {
      onChange(nextLatitude, nextLongitude);
      return;
    }
    if (!manualStart) {
      setManualStart([nextLatitude, nextLongitude]);
      return;
    }
    onChange(nextLatitude, nextLongitude);
  }

  function resetManualPoints() {
    setManualStart(null);
    onChange(null, null);
  }

  function useCurrentLocation() {
    setLocationError("");
    if (!globalThis.navigator?.geolocation) {
      setLocationError("El navegador no admite geolocalización.");
      return;
    }
    globalThis.navigator.geolocation.getCurrentPosition(
      ({ coords }) => selectPoint(coords.latitude, coords.longitude),
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
          <Typography fontWeight={600}>Inicio y destino</Typography>
          <Typography variant="body2" color="text.secondary">
            {manual
              ? "Primer clic: inicio. Segundo clic: destino. Otro clic mueve el destino."
              : "El inicio es el local de despacho. Un clic marca el destino; otro clic lo mueve."}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {manual && (manualStart || position) && (
            <Button size="small" type="button" onClick={resetManualPoints}>
              Reiniciar
            </Button>
          )}
          <Button
            size="small"
            type="button"
            variant="outlined"
            startIcon={<MyLocationRoundedIcon />}
            onClick={useCurrentLocation}
          >
            Usar mi ubicación
          </Button>
        </Stack>
      </Stack>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={mode}
        aria-label="Forma de marcar el recorrido"
        onChange={(_, value) => {
          if (!value || value === mode) return;
          setManualStart(null);
          setMode(value);
        }}
        sx={{ mb: 1 }}
      >
        <ToggleButton value="depot">Desde el local</ToggleButton>
        <ToggleButton value="points">Punto a punto</ToggleButton>
      </ToggleButtonGroup>
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
          <MapController
            points={mapPoints}
            onSelect={selectPoint}
          />
          {!manual && (
            <CircleMarker
              center={DEPOT}
              radius={8}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: "#2e7d32",
                fillOpacity: 1,
              }}
            >
              <Popup>Inicio: local de despacho</Popup>
            </CircleMarker>
          )}
          {manual && manualStart && (
            <CircleMarker
              center={manualStart}
              radius={8}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: "#2e7d32",
                fillOpacity: 1,
              }}
            >
              <Popup>Inicio marcado</Popup>
            </CircleMarker>
          )}
          {line && (
            <Polyline
              positions={line}
              pathOptions={{ color: "#1976d2", weight: 3, dashArray: "6 8" }}
            />
          )}
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
            >
              <Popup>Destino de la entrega</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {manual ? "Verde: inicio" : "Verde: inicio fijo"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Azul: destino
        </Typography>
      </Stack>
      {manual && manualStart && !position && (
        <Alert severity="info" sx={{ mt: 1 }}>
          Inicio marcado. Haga clic en el mapa para marcar el destino.
        </Alert>
      )}
      {position ? (
        <Alert severity="success" sx={{ mt: 1 }}>
          Destino listo. Punto seleccionado: {parsedLatitude.toFixed(6)},{" "}
          {parsedLongitude.toFixed(6)}.{" "}
          {manual
            ? manualStart
              ? "El recorrido va del punto verde al azul. Guarde el pedido para cerrar."
              : "Haga clic para marcar el inicio del recorrido."
            : "No hace falta un segundo clic: el recorrido sale del local de despacho. Guarde el pedido para cerrar."}
        </Alert>
      ) : (
        !manualStart && (
          <Typography variant="caption" color="text.secondary">
            {manual
              ? "Haga clic en el mapa para marcar el inicio."
              : "Haga clic en el mapa para marcar el destino."}
          </Typography>
        )
      )}
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
