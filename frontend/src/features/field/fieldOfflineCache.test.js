import { beforeEach, describe, expect, it } from "vitest";
import {
  clearPendingFieldSync,
  listPendingFieldSync,
  loadCachedDriverRoute,
  queueFieldSync,
  saveCachedDriverRoute,
} from "./fieldOfflineCache.js";

beforeEach(() => {
  globalThis.localStorage.clear();
});

describe("fieldOfflineCache", () => {
  it("guarda y recupera la ruta del conductor", () => {
    expect(loadCachedDriverRoute("user-1")).toBeNull();
    saveCachedDriverRoute("user-1", {
      routes: [{ id: "r1" }],
      selectedId: "r1",
      stops: [],
      navigation: null,
    });
    const cached = loadCachedDriverRoute("user-1");
    expect(cached.routes).toEqual([{ id: "r1" }]);
    expect(cached.selectedId).toBe("r1");
    expect(cached.savedAt).toBeTruthy();
  });

  it("encola y limpia la sincronización pendiente", () => {
    expect(listPendingFieldSync("user-1")).toEqual([]);
    queueFieldSync("user-1", { type: "refresh" });
    expect(listPendingFieldSync("user-1")).toEqual([{ type: "refresh" }]);
    clearPendingFieldSync("user-1");
    expect(listPendingFieldSync("user-1")).toEqual([]);
  });

  it("tolera JSON corrupto en localStorage", () => {
    globalThis.localStorage.setItem("wanka.field.route.user-1", "{no-json");
    expect(loadCachedDriverRoute("user-1")).toBeNull();
  });
});
