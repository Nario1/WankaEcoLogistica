import { describe, expect, it } from "vitest";
import { DISPATCH_DEPOT } from "./depot.js";

describe("DISPATCH_DEPOT", () => {
  it("ubica el local de despacho en Huancayo", () => {
    expect(DISPATCH_DEPOT.name).toBe("Local de despacho");
    expect(DISPATCH_DEPOT.latitude).toBeCloseTo(-12.07, 1);
    expect(DISPATCH_DEPOT.longitude).toBeCloseTo(-75.2, 1);
  });
});
