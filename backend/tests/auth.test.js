import test from "node:test";
import assert from "node:assert/strict";
import { login, requireRole, resetAuthForTests } from "../src/modules/auth.js";

test("EN-002: autentica al operador y respeta RBAC", () => {
  resetAuthForTests();
  const session = login({ email: "operador@wanka.pe", password: "Wanka2026!" });
  assert.equal(requireRole(`Bearer ${session.token}`, ["OPERADOR"]).role, "OPERADOR");
  assert.throws(() => requireRole(`Bearer ${session.token}`, ["ADMINISTRADOR"]), { status: 403 });
});

test("EN-002: rechaza credenciales inválidas", () => {
  resetAuthForTests();
  assert.throws(() => login({ email: "operador@wanka.pe", password: "incorrecta" }), { status: 401 });
});
