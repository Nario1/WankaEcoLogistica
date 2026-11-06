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

  it("registra el worker al cargar la página", () => {
    const register = vi.fn(() => Promise.resolve());
    const addEventListener = vi.fn((event, handler) => {
      if (event === "load") handler();
    });
    vi.stubGlobal("navigator", {
      serviceWorker: { register },
    });
    vi.stubGlobal("window", { addEventListener });
    registerServiceWorker();
    expect(addEventListener).toHaveBeenCalledWith("load", expect.any(Function));
    expect(register).toHaveBeenCalledWith("/sw.js");
  });
});
