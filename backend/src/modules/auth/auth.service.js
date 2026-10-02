import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError, unauthorized } from "../../shared/errors.js";
import { requireEmail, requireString } from "../../shared/validation.js";

const MAX_FAILED_ATTEMPTS = 3;
const LOCK_MINUTES = 15;

export class AuthService {
  constructor({
    userRepository,
    auditRepository,
    jwtSecret,
    jwtExpiresIn,
    now = () => new Date(),
  }) {
    this.userRepository = userRepository;
    this.auditRepository = auditRepository;
    this.jwtSecret = jwtSecret;
    this.jwtExpiresIn = jwtExpiresIn;
    this.now = now;
  }

  async login(input, metadata = {}) {
    const email = requireEmail(input?.email);
    const password = requireString(input?.password, "password", {
      min: 8,
      max: 128,
    });
    const user = await this.userRepository.findByEmail(email);
    const now = this.now();

    if (user?.lockedUntil && new Date(user.lockedUntil) > now) {
      throw new AppError(
        423,
        "ACCOUNT_LOCKED",
        "Cuenta bloqueada temporalmente",
      );
    }

    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;
    if (!user || !passwordMatches || user.status !== "ACTIVE") {
      if (user && user.status === "ACTIVE") {
        await this.userRepository.recordFailedLogin(
          user.id,
          MAX_FAILED_ATTEMPTS,
          LOCK_MINUTES,
          now,
        );
      }
      await this.auditRepository.record({
        userId: user?.id ?? null,
        action: "AUTH_LOGIN_FAILED",
        entity: "users",
        entityId: user?.id ?? null,
        metadata: { ip: metadata.ip },
      });
      throw unauthorized();
    }

    await this.userRepository.resetLoginAttempts(user.id);
    await this.auditRepository.record({
      userId: user.id,
      action: "AUTH_LOGIN_SUCCEEDED",
      entity: "users",
      entityId: user.id,
      metadata: { ip: metadata.ip },
    });

    const token = jwt.sign({ sub: user.id, role: user.role }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: "wanka-ecologistica-api",
      audience: "wanka-ecologistica-web",
    });

    return { token, user: this.sanitizeUser(user) };
  }

  sanitizeUser(user) {
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
