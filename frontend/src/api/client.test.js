import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest, formatApiError } from "./client.js";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("formatApiError", () => {
  it("devuelve el mensaje simple cuando no hay detalles", () => {
    expect(formatApiError(new Error("Fallo genérico"))).toBe("Fallo genérico");
    expect(formatApiError(new ApiError("Sin detalles"))).toBe("Sin detalles");
  });

  it("une los campos inválidos al mensaje", () => {
    const error = new ApiError("Datos inválidos", {
      details: { weightKg: "debe ser positivo", plate: "formato inválido" },
    });
    expect(formatApiError(error)).toContain("weightKg: debe ser positivo");
    expect(formatApiError(error)).toContain("plate: formato inválido");
  });
});

describe("apiRequest", () => {
  it("devuelve data cuando la respuesta es correcta", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ data: { id: "1" } }),
      })),
    );
    await expect(apiRequest("/orders", { token: "abc" })).resolves.toEqual({
      id: "1",
    });
    expect(fetch).toHaveBeenCalledOnce();
    const headers = fetch.mock.calls[0][1].headers;
    expect(headers.get("authorization")).toBe("Bearer abc");
  });

  it("lanza ApiError cuando el servidor responde error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 409,
        json: async () => ({
          error: { message: "Conflicto", code: "CONFLICT" },
        }),
      })),
    );
    await expect(apiRequest("/routes")).rejects.toMatchObject({
      name: "ApiError",
      status: 409,
      code: "CONFLICT",
      message: "Conflicto",
    });
  });

  it("lanza ApiError si no hay conexión", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );
    await expect(apiRequest("/health")).rejects.toMatchObject({
      message: "No se pudo conectar con el servidor",
    });
  });
});
