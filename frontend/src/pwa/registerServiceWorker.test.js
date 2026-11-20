import { afterEach, describe, expect, it, vi } from "vitest";
import { registerServiceWorker } from "./registerServiceWorker.js";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("registerServiceWorker", () => {
  it("no falla si el navegador no soporta service workers", () => {
    vi.stubGlobal("navigator", {});
    expect(() => registerServiceWorker()).not.toThrow();
  });

  it("no registra el worker en modo desarrollo (Vite DEV)", () => {
    const register = vi.fn(() => Promise.resolve());
    const addEventListener = vi.fn();
    vi.stubGlobal("navigator", {
      serviceWorker: { register },
    });
    vi.stubGlobal("window", { addEventListener });
    // Vitest/Vite corre con import.meta.env.DEV === true.
    registerServiceWorker();
    expect(addEventListener).not.toHaveBeenCalled();
    expect(register).not.toHaveBeenCalled();
  });
});
