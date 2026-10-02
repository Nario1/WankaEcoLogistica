export class MemoryAuditRepository {
  constructor() {
    this.entries = [];
  }
  async record(entry) {
    this.entries.push(entry);
  }
}

export class MemoryUserRepository {
  constructor(users = []) {
    this.users = users;
  }
  async findByEmail(email) {
    return this.users.find((user) => user.email === email) ?? null;
  }
  async findById(id) {
    return this.users.find((user) => user.id === id) ?? null;
  }
  async recordFailedLogin(id, maxAttempts, lockMinutes, now) {
    const user = await this.findById(id);
    const failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
    Object.assign(user, {
      failedLoginAttempts,
      lockedUntil:
        failedLoginAttempts >= maxAttempts
          ? new Date(now.getTime() + lockMinutes * 60_000)
          : null,
    });
  }
  async resetLoginAttempts(id) {
    Object.assign(await this.findById(id), {
      failedLoginAttempts: 0,
      lockedUntil: null,
    });
  }
  async listDrivers() {
    return this.users.filter((user) => user.role === "DRIVER");
  }
  async createDriver(driver) {
    const created = {
      id: crypto.randomUUID(),
      ...driver,
      role: "DRIVER",
      status: "ACTIVE",
    };
    this.users.push(created);
    return created;
  }
}

export class MemoryRepository {
  constructor(records = []) {
    this.records = records;
  }
  async list() {
    return this.records;
  }
  async findById(id) {
    return this.records.find((record) => record.id === id) ?? null;
  }
  async create(input) {
    const record = { id: crypto.randomUUID(), ...input };
    this.records.push(record);
    return record;
  }
  async update(id, input) {
    const record = await this.findById(id);
    Object.assign(record, input);
    return record;
  }
}
