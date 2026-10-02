import { createPool } from "./config/database.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { OrderService } from "./modules/orders/order.service.js";
import { VehicleService } from "./modules/vehicles/vehicle.service.js";
import { DriverService } from "./modules/drivers/driver.service.js";
import { RouteService } from "./modules/routes/route.service.js";
import { PgAuditRepository } from "./infrastructure/postgres/audit.repository.js";
import { PgOrderRepository } from "./infrastructure/postgres/order.repository.js";
import { PgRouteRepository } from "./infrastructure/postgres/route.repository.js";
import { PgUserRepository } from "./infrastructure/postgres/user.repository.js";
import { PgVehicleRepository } from "./infrastructure/postgres/vehicle.repository.js";

export function createContainer(config) {
  const pool = createPool(config);
  const auditRepository = new PgAuditRepository(pool);
  const userRepository = new PgUserRepository(pool);
  const orderRepository = new PgOrderRepository(pool);
  const vehicleRepository = new PgVehicleRepository(pool);
  const routeRepository = new PgRouteRepository(pool);
  const common = { auditRepository };

  return {
    pool,
    services: {
      authService: new AuthService({
        userRepository,
        auditRepository,
        jwtSecret: config.jwtSecret,
        jwtExpiresIn: config.jwtExpiresIn,
      }),
      orderService: new OrderService({ orderRepository, ...common }),
      vehicleService: new VehicleService({ vehicleRepository, ...common }),
      driverService: new DriverService({ userRepository, ...common }),
      routeService: new RouteService({
        routeRepository,
        userRepository,
        vehicleRepository,
        ...common,
      }),
    },
  };
}
