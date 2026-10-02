import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { AuthService } from "../src/modules/auth/auth.service.js";
import {
  MemoryAuditRepository,
  MemoryUserRepository,
} from "./helpers/fakes.js";

const secret = "a-secure-test-secret-with-more-than-32-chars";

test("login exitoso retorna token y no expone el hash", async () => {
  const user = {
    id: "user-1",
    email: "admin@example.com",
    name: "Admin",
    role: "ADMIN",
    status: "ACTIVE",
    passwordHash: await bcrypt.hash("ValidPassword123", 4),
    failedLoginAttempts: 0,
  };
  const repository = new MemoryUserRepository([user]);
  const service = new AuthService({
    userRepository: repository,
    auditRepository: new MemoryAuditRepository(),
    jwtSecret: secret,
    jwtExpiresIn: "15m",
  });
  const result = await service.login({
    email: "ADMIN@example.com",
    password: "ValidPassword123",
  });
  assert.ok(result.token);
  assert.equal(result.user.email, "admin@example.com");
  assert.equal(result.user.passwordHash, undefined);
});

test("tercer intento fallido bloquea la cuenta por 15 minutos", async () => {
  const now = new Date("2026-10-01T12:00:00Z");
  const user = {
    id: "user-1",
    email: "admin@example.com",
    name: "Admin",
    role: "ADMIN",
    status: "ACTIVE",
    passwordHash: await bcrypt.hash("ValidPassword123", 4),
    failedLoginAttempts: 2,
  };
  const repository = new MemoryUserRepository([user]);
  const service = new AuthService({
    userRepository: repository,
    auditRepository: new MemoryAuditRepository(),
    jwtSecret: secret,
    jwtExpiresIn: "15m",
    now: () => now,
  });
  await assert.rejects(
    service.login({ email: user.email, password: "InvalidPassword" }),
    { code: "UNAUTHORIZED" },
  );
  assert.equal(user.failedLoginAttempts, 3);
  assert.equal(user.lockedUntil.toISOString(), "2026-10-01T12:15:00.000Z");
  await assert.rejects(
    service.login({ email: user.email, password: "ValidPassword123" }),
    { code: "ACCOUNT_LOCKED" },
  );
});
