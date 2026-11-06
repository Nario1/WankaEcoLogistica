import test from "node:test";
import assert from "node:assert/strict";
import {
  consolidateIndicators,
  parsePeriod,
  SIERRA_CENTRAL_EMISSION_FACTOR,
} from "../src/modules/sustainability/indicators.service.js";
import {
  buildReportCsv,
  buildReportPdf,
  MAX_REPORT_ROWS,
  ReportsService,
} from "../src/modules/sustainability/reports.service.js";

const period = {
  from: new Date("2026-11-01T00:00:00Z"),
  to: new Date("2026-11-07T23:59:59Z"),
};

test("parsePeriod rechaza rangos invertidos o demasiado amplios", () => {
  assert.throws(
    () =>
      parsePeriod({
        from: "2026-11-10T00:00:00Z",
        to: "2026-11-01T00:00:00Z",
      }),
    { code: "VALIDATION_ERROR" },
  );
  assert.throws(
    () =>
      parsePeriod({
        from: "2026-01-01T00:00:00Z",
        to: "2026-06-01T00:00:00Z",
      }),
    { code: "VALIDATION_ERROR" },
  );
});

test("periodo sin operaciones no inventa indicadores", () => {
  const result = consolidateIndicators([], [], period);
  assert.equal(result.hasData, false);
  assert.match(result.message, /no hay operaciones/i);
  assert.equal(result.co2, undefined);
});

test("consolida CO₂, ahorro de distancia y nivel de servicio", () => {
  const result = consolidateIndicators(
    [
      {
        distanceKm: 10,
        baselineDistanceKm: 14,
        emissionFactor: 0.21,
        emissionsKgCo2: 2.1,
      },
      {
        distanceKm: 20,
        baselineDistanceKm: 26,
        emissionFactor: 0.21,
        emissionsKgCo2: 4.2,
      },
    ],
    [
      { routeStatus: "COMPLETED" },
      { routeStatus: "COMPLETED" },
      { routeStatus: "PLANNED" },
    ],
    period,
  );

  assert.equal(result.hasData, true);
  assert.equal(result.co2.emissionsKgCo2, 6.3);
  assert.equal(result.co2.emissionFactorUsed, 0.21);
  assert.equal(result.co2.referenceFactor, SIERRA_CENTRAL_EMISSION_FACTOR);
  assert.equal(result.distance.optimizedKm, 30);
  assert.equal(result.distance.baselineKm, 40);
  assert.equal(result.distance.savedKm, 10);
  assert.equal(result.distance.savedPercent, 25);
  assert.equal(result.serviceLevel.percent, 66.67);
  assert.equal(result.serviceLevel.completedOrders, 2);
  assert.equal(result.serviceLevel.totalOrders, 3);
});

test("exporta CSV y PDF con el resumen del periodo", () => {
  const indicators = consolidateIndicators(
    [
      {
        id: "r1",
        startsAt: "2026-11-02T13:00:00.000Z",
        endsAt: "2026-11-02T16:00:00.000Z",
        status: "COMPLETED",
        distanceKm: 12,
        baselineDistanceKm: 15,
        emissionsKgCo2: 2.52,
        vehiclePlate: "ABC-123",
        emissionFactor: 0.21,
        optimized: true,
      },
    ],
    [
      {
        id: "o1",
        routeId: "r1",
        productName: "Caja",
        address: "Jr. Lima 1",
        status: "PLANNED",
        routeStatus: "COMPLETED",
        deliveryOrder: 1,
      },
    ],
    period,
  );

  const csv = buildReportCsv({
    indicators,
    routes: [
      {
        id: "r1",
        startsAt: "2026-11-02T13:00:00.000Z",
        endsAt: "2026-11-02T16:00:00.000Z",
        status: "COMPLETED",
        distanceKm: 12,
        baselineDistanceKm: 15,
        emissionsKgCo2: 2.52,
        vehiclePlate: "ABC-123",
        emissionFactor: 0.21,
        optimized: true,
      },
    ],
    orders: [
      {
        id: "o1",
        routeId: "r1",
        productName: "Caja",
        address: "Jr. Lima 1",
        status: "PLANNED",
        routeStatus: "COMPLETED",
        deliveryOrder: 1,
      },
    ],
  });
  assert.match(csv, /emissionsKgCo2,2\.52/);
  assert.match(csv, /ABC-123/);

  const pdf = buildReportPdf({
    indicators,
    routes: [
      {
        vehiclePlate: "ABC-123",
        status: "COMPLETED",
        distanceKm: 12,
        emissionsKgCo2: 2.52,
      },
    ],
  });
  assert.ok(Buffer.isBuffer(pdf));
  assert.match(pdf.toString("latin1"), /%PDF-1\.4/);
  assert.match(pdf.toString("utf8"), /WankaEcoLogistica/);
});

test("ReportsService bloquea exportaciones que exceden el límite de filas", async () => {
  const routes = Array.from({ length: MAX_REPORT_ROWS + 1 }, (_, index) => ({
    id: `r-${index}`,
  }));
  const service = new ReportsService({
    indicatorsRepository: {
      listRoutesInPeriod: async () => routes,
      listOrdersInPeriod: async () => [],
    },
    auditRepository: { record: async () => {} },
  });

  await assert.rejects(
    () =>
      service.export(
        {
          from: "2026-11-01T00:00:00Z",
          to: "2026-11-07T23:59:59Z",
          format: "csv",
        },
        "admin-1",
      ),
    { code: "VALIDATION_ERROR" },
  );
});
