import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DISPATCH_DEPOT } from "../shared/depot";

const HUANCAYO_CENTER = [-12.0651, -75.2049];
const DEPOT = [DISPATCH_DEPOT.latitude, DISPATCH_DEPOT.longitude];

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
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const modeRef = useRef("depot");
  const manualStartRef = useRef(null);

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

  onChangeRef.current = onChange;
  modeRef.current = mode;
  manualStartRef.current = manualStart;

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined;

    const map = L.map(mapNodeRef.current, {
      center: HUANCAYO_CENTER,
      zoom: 13,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    map.on("click", (event) => {
      const nextLatitude = event.latlng.lat;
      const nextLongitude = event.latlng.lng;
      if (modeRef.current !== "points") {
        onChangeRef.current(nextLatitude, nextLongitude);
        return;
      }
      if (!manualStartRef.current) {
        setManualStart([nextLatitude, nextLongitude]);
        return;
      }
      onChangeRef.current(nextLatitude, nextLongitude);
    });
    mapRef.current = map;
    map.invalidateSize();

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layerRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    if (!manual) {
      L.circleMarker(DEPOT, {
        radius: 8,
        color: "#ffffff",
        weight: 2,
        fillColor: "#2e7d32",
        fillOpacity: 1,
      })
        .bindPopup("Inicio: local de despacho")
        .addTo(layers);
    }

    if (manual && manualStart) {
      L.circleMarker(manualStart, {
        radius: 8,
        color: "#ffffff",
        weight: 2,
        fillColor: "#2e7d32",
        fillOpacity: 1,
      })
        .bindPopup("Inicio marcado")
        .addTo(layers);
    }

    if (line) {
      L.polyline(line, {
        color: "#1976d2",
        weight: 3,
        dashArray: "6 8",
      }).addTo(layers);
    }

    if (position) {
      L.circleMarker(position, {
        radius: 11,
        color: "#ffffff",
        weight: 3,
        fillColor: "#1976d2",
        fillOpacity: 1,
      })
        .bindPopup("Destino de la entrega")
        .addTo(layers);
    }

    const points = line ?? (manualStart ? [manualStart] : manual ? [] : [DEPOT]);
    if (points.length > 1) {
      map.fitBounds(points, { padding: [36, 36], maxZoom: 14 });
    } else if (position) {
      map.setView(position, 13);
    } else {
      map.setView(HUANCAYO_CENTER, 13);
    }
    map.invalidateSize();
  }, [line, manual, manualStart, position]);

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
        ref={mapNodeRef}
        sx={{
          height: 320,
          borderRadius: 2,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
        }}
      />
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
