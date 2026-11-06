import { describe, expect, it } from "vitest";
import { formatDateTime, formatTime } from "./format.js";

describe("formatTime", () => {
  it("convierte mediodía y medianoche a 12 horas", () => {
    expect(formatTime("00:05")).toBe("12:05 AM");
    expect(formatTime("12:30")).toBe("12:30 PM");
    expect(formatTime("15:07")).toBe("03:07 PM");
  });
});

describe("formatDateTime", () => {
  it("formatea una fecha ISO en español de Perú", () => {
    const formatted = formatDateTime("2026-10-08T13:00:00.000Z");
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(formatted).toMatch(/AM|PM/);
  });
});
