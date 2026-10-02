import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createAuthenticate } from "./modules/auth/auth.middleware.js";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { createOrderRouter } from "./modules/orders/order.routes.js";
import { createVehicleRouter } from "./modules/vehicles/vehicle.routes.js";
import { createDriverRouter } from "./modules/drivers/driver.routes.js";
import { createRouteRouter } from "./modules/routes/route.routes.js";
import { createEmissionsRouter } from "./modules/sustainability/emissions.routes.js";
import { errorHandler, notFoundHandler } from "./shared/http.js";

export function createApp({ config, services }) {
  const app = express();
  const authenticate = createAuthenticate(config);

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, credentials: false }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_request, response) =>
    response.json({ data: { status: "ok" } }),
  );
  app.use("/api/auth", createAuthRouter({ authService: services.authService }));
  app.use(
    "/api/orders",
    createOrderRouter({ orderService: services.orderService, authenticate }),
  );
  app.use(
    "/api/vehicles",
    createVehicleRouter({
      vehicleService: services.vehicleService,
      authenticate,
    }),
  );
  app.use(
    "/api/drivers",
    createDriverRouter({ driverService: services.driverService, authenticate }),
  );
  app.use(
    "/api/routes",
    createRouteRouter({ routeService: services.routeService, authenticate }),
  );
  app.use("/api/emissions", createEmissionsRouter({ authenticate }));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
