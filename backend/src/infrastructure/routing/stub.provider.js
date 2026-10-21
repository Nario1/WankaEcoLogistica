/**
 * Proveedor de pruebas: no llama a APIs externas.
 * Permite sustituir OSRM/TomTom en staging o unit tests sin tocar el dominio.
 */
export class StubRoutingProvider {
  constructor({ label = "Stub / pruebas" } = {}) {
    this.name = label;
  }

  async calculate(points) {
    if (!Array.isArray(points) || points.length < 2) {
      throw new Error("Se requieren al menos dos puntos para el stub de ruteo");
    }
    const geometry = points.map((point) => [point.latitude, point.longitude]);
    let distanceKm = 0;
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const deltaLat = current.latitude - previous.latitude;
      const deltaLng = current.longitude - previous.longitude;
      distanceKm += Math.hypot(deltaLat, deltaLng) * 111;
    }
    return {
      provider: this.name,
      trafficConsidered: false,
      distanceKm: Number(distanceKm.toFixed(2)),
      durationMinutes: Math.max(1, Math.ceil(distanceKm * 3)),
      trafficDelayMinutes: null,
      geometry,
    };
  }
}
