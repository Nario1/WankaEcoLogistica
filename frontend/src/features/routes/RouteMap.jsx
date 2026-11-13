import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatTime } from "../../utils/format";
import { DISPATCH_DEPOT } from "../shared/depot";

const HUANCAYO_CENTER = [-12.0651, -75.2049];

function popupHtml(title, lines) {
  return `<strong>${title}</strong><br/>${lines.join("<br/>")}`;
}

export default function RouteMap({ route, stops, navigation, loading }) {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined;

    const map = L.map(mapNodeRef.current, {
      center: HUANCAYO_CENTER,
      zoom: 13,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

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

    const nextStopPositions = stops.map((stop) => [
      stop.latitude,
      stop.longitude,
    ]);
    const nextDepot = [DISPATCH_DEPOT.latitude, DISPATCH_DEPOT.longitude];
    const nextRoad = navigation?.geometry ?? [];
    const nextMarkers = route ? [nextDepot, ...nextStopPositions] : [];
    const nextPositions = nextRoad.length ? nextRoad : nextMarkers;

    layers.clearLayers();

    if (nextRoad.length > 1) {
      L.polyline(nextRoad, {
        color: "#087f5b",
        weight: 5,
        opacity: 0.8,
      }).addTo(layers);
    }

    if (route) {
      L.circleMarker(nextDepot, {
        radius: 15,
        color: "#ffffff",
        weight: 3,
        fillColor: "#d84315",
        fillOpacity: 1,
      })
        .bindPopup(
          popupHtml(DISPATCH_DEPOT.name, [
            "Inicio de todas las rutas",
            `${DISPATCH_DEPOT.latitude}, ${DISPATCH_DEPOT.longitude}`,
          ]),
        )
        .addTo(layers);
    }

    stops.forEach((stop, index) => {
      L.circleMarker(nextStopPositions[index], {
        radius: 13,
        color: "#ffffff",
        weight: 3,
        fillColor: "#087f5b",
        fillOpacity: 1,
      })
        .bindPopup(
          popupHtml(`Parada ${stop.deliveryOrder}`, [
            stop.productName ?? "",
            stop.address ?? "",
            `${stop.weightKg} kg · ${formatTime(stop.windowStart)}-${formatTime(stop.windowEnd)}`,
          ]),
        )
        .addTo(layers);
    });

    if (nextPositions.length === 1) {
      map.setView(nextPositions[0], 15);
    } else if (nextPositions.length > 1) {
      map.fitBounds(nextPositions, { padding: [36, 36] });
    } else {
      map.setView(HUANCAYO_CENTER, 13);
    }

    map.invalidateSize();
  }, [navigation, route, stops]);

  return (
    <Box sx={{ mt: 3 }}>
      <Stack spacing={0.5} sx={{ mb: 1.5 }}>
        <Typography variant="h6">Mapa de la ruta optimizada</Typography>
        {route && (
          <Typography variant="body2" color="text.secondary">
            {route.vehiclePlate} ·{" "}
            {navigation?.distanceKm ?? route.distanceKm ?? 0} km · tiempo
            estimado {navigation?.durationMinutes ?? "—"} min ·{" "}
            {stops.length === 1 ? "1 parada" : `${stops.length} paradas`}
          </Typography>
        )}
      </Stack>
      <Box
        ref={mapNodeRef}
        role="region"
        aria-label="Mapa de la ruta"
        sx={{
          height: { xs: 360, md: 480 },
          borderRadius: 2,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
        }}
      />
      {route && navigation && (
        <Alert severity={navigation.trafficConsidered ? "success" : "info"}>
          Tiempo estimado de viaje: {navigation.durationMinutes} min
          {navigation.distanceKm != null ? ` · ${navigation.distanceKm} km` : ""}
          . Trazado de {navigation.provider}.
          {navigation.trafficConsidered
            ? navigation.trafficDelayMinutes > 0
              ? ` Tráfico incluido; demora adicional: ${navigation.trafficDelayMinutes} min.`
              : " Tráfico incluido, sin demora adicional."
            : " El tráfico en tiempo real requiere configurar TOMTOM_API_KEY en el backend."}
        </Alert>
      )}
      {route && !navigation && !loading && (
        <Alert severity="warning">
          No se pudo obtener el trazado vial. No se dibuja una línea recta como
          si fuera una ruta válida.
        </Alert>
      )}
      <Typography variant="caption" color="text.secondary">
        {loading
          ? "Cargando paradas…"
          : route && stops.length
            ? "La línea sigue calles transitables desde el local hasta las paradas en el orden calculado."
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
      productName: PropTypes.string,
      weightKg: PropTypes.number,
      windowStart: PropTypes.string,
      windowEnd: PropTypes.string,
    }),
  ).isRequired,
  loading: PropTypes.bool,
  navigation: PropTypes.shape({
    provider: PropTypes.string.isRequired,
    trafficConsidered: PropTypes.bool.isRequired,
    distanceKm: PropTypes.number.isRequired,
    durationMinutes: PropTypes.number.isRequired,
    trafficDelayMinutes: PropTypes.number,
    geometry: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number).isRequired)
      .isRequired,
  }),
};
