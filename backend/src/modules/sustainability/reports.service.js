import { badRequest } from "../../shared/errors.js";
import { requireEnum } from "../../shared/validation.js";
import {
  MAX_INDICATOR_RANGE_DAYS,
  parsePeriod,
  consolidateIndicators,
} from "./indicators.service.js";

export const MAX_REPORT_ROWS = 2_000;
export const REPORT_FORMATS = ["csv", "pdf"];

function escapeCsv(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function csvLine(values) {
  return values.map(escapeCsv).join(",");
}

export function buildReportCsv({ indicators, routes, orders }) {
  const lines = [
    csvLine(["Sección", "Campo", "Valor"]),
    csvLine(["periodo", "from", indicators.period.from]),
    csvLine(["periodo", "to", indicators.period.to]),
    csvLine(["resumen", "hasData", indicators.hasData]),
  ];

  if (!indicators.hasData) {
    lines.push(csvLine(["resumen", "message", indicators.message]));
    return `${lines.join("\n")}\n`;
  }

  lines.push(
    csvLine(["co2", "emissionsKgCo2", indicators.co2.emissionsKgCo2]),
    csvLine(["co2", "emissionFactorUsed", indicators.co2.emissionFactorUsed]),
    csvLine(["distance", "optimizedKm", indicators.distance.optimizedKm]),
    csvLine(["distance", "baselineKm", indicators.distance.baselineKm]),
    csvLine(["distance", "savedKm", indicators.distance.savedKm]),
    csvLine(["distance", "savedPercent", indicators.distance.savedPercent]),
    csvLine([
      "serviceLevel",
      "percent",
      indicators.serviceLevel.percent,
    ]),
    csvLine([
      "serviceLevel",
      "completedOrders",
      indicators.serviceLevel.completedOrders,
    ]),
    csvLine([
      "serviceLevel",
      "totalOrders",
      indicators.serviceLevel.totalOrders,
    ]),
    "",
    csvLine([
      "ruta_id",
      "inicio",
      "fin",
      "estado",
      "distancia_km",
      "distancia_base_km",
      "emisiones_co2",
      "placa",
      "factor_emision",
      "optimizada",
    ]),
  );

  for (const route of routes) {
    lines.push(
      csvLine([
        route.id,
        route.startsAt,
        route.endsAt,
        route.status,
        route.distanceKm,
        route.baselineDistanceKm,
        route.emissionsKgCo2,
        route.vehiclePlate,
        route.emissionFactor,
        route.optimized,
      ]),
    );
  }

  lines.push(
    "",
    csvLine([
      "pedido_id",
      "ruta_id",
      "producto",
      "direccion",
      "estado_pedido",
      "estado_ruta",
      "orden_entrega",
    ]),
  );
  for (const order of orders) {
    lines.push(
      csvLine([
        order.id,
        order.routeId,
        order.productName,
        order.address,
        order.status,
        order.routeStatus,
        order.deliveryOrder,
      ]),
    );
  }

  return `${lines.join("\n")}\n`;
}

function pdfEscape(text) {
  return String(text).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

export function buildReportPdf({ indicators, routes }) {
  const lines = [
    "WankaEcoLogistica — Reporte operativo",
    `Periodo: ${indicators.period.from} → ${indicators.period.to}`,
  ];

  if (!indicators.hasData) {
    lines.push(indicators.message);
  } else {
    lines.push(
      `Rutas: ${indicators.routeCount}`,
      `Pedidos: ${indicators.orderCount}`,
      `CO2 (kg): ${indicators.co2.emissionsKgCo2}`,
      `Factor emisión: ${indicators.co2.emissionFactorUsed}`,
      `Distancia optimizada (km): ${indicators.distance.optimizedKm}`,
      `Línea base (km): ${indicators.distance.baselineKm ?? "N/D"}`,
      `Ahorro (km): ${indicators.distance.savedKm ?? "N/D"}`,
      `Ahorro (%): ${indicators.distance.savedPercent ?? "N/D"}`,
      `Nivel de servicio (%): ${indicators.serviceLevel.percent ?? "N/D"}`,
      "",
      "Rutas del periodo:",
    );
    for (const route of routes.slice(0, 40)) {
      lines.push(
        `- ${route.vehiclePlate ?? "s/p"} | ${route.status} | ${route.distanceKm ?? 0} km | CO2 ${route.emissionsKgCo2 ?? 0}`,
      );
    }
    if (routes.length > 40) {
      lines.push(`… y ${routes.length - 40} rutas adicionales (ver CSV).`);
    }
  }

  const content = lines
    .map((line, index) => `BT /F1 11 Tf 40 ${780 - index * 16} Td (${pdfEscape(line)}) Tj ET`)
    .join("\n");
  const objects = [
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj",
    "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj",
    `4 0 obj<< /Length ${Buffer.byteLength(content, "utf8")} >>stream\n${content}\nendstream\nendobj`,
    "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${object}\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

export class ReportsService {
  constructor({ indicatorsRepository, auditRepository }) {
    this.indicatorsRepository = indicatorsRepository;
    this.auditRepository = auditRepository;
  }

  async export(query, actorId) {
    const period = parsePeriod(query);
    const format = requireEnum(
      String(query?.format ?? "").toLowerCase(),
      "format",
      REPORT_FORMATS,
    );

    const [routes, orders] = await Promise.all([
      this.indicatorsRepository.listRoutesInPeriod(period.from, period.to),
      this.indicatorsRepository.listOrdersInPeriod(period.from, period.to),
    ]);

    const rowCount = routes.length + orders.length;
    if (rowCount > MAX_REPORT_ROWS) {
      throw badRequest(
        `El reporte supera el límite de ${MAX_REPORT_ROWS} filas; acote el rango de fechas (máximo ${MAX_INDICATOR_RANGE_DAYS} días)`,
        {
          from: "Reduzca el periodo",
          to: "Reduzca el periodo",
        },
      );
    }

    const indicators = consolidateIndicators(routes, orders, period);
    const stamp = period.from.toISOString().slice(0, 10);
    await this.auditRepository.record({
      userId: actorId,
      action: "REPORT_EXPORTED",
      entity: "reports",
      entityId: null,
      metadata: {
        format,
        from: period.from.toISOString(),
        to: period.to.toISOString(),
        rowCount,
      },
    });

    if (format === "csv") {
      return {
        format,
        filename: `reporte-operacion-${stamp}.csv`,
        contentType: "text/csv; charset=utf-8",
        body: buildReportCsv({ indicators, routes, orders }),
      };
    }

    return {
      format,
      filename: `reporte-operacion-${stamp}.pdf`,
      contentType: "application/pdf",
      body: buildReportPdf({ indicators, routes }),
    };
  }
}
