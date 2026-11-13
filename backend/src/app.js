import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { createAuthenticate } from "./modules/auth/auth.middleware.js";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { createOrderRouter } from "./modules/orders/order.routes.js";
import { createVehicleRouter } from "./modules/vehicles/vehicle.routes.js";
import { createDriverRouter } from "./modules/drivers/driver.routes.js";
import { createRouteRouter } from "./modules/routes/route.routes.js";
import { createEmissionsRouter } from "./modules/sustainability/emissions.routes.js";
import { createIndicatorsRouter } from "./modules/sustainability/indicators.routes.js";
import { createReportsRouter } from "./modules/sustainability/reports.routes.js";
import { createOptimizationRouter } from "./modules/optimization/optimization.routes.js";
import { errorHandler, notFoundHandler } from "./shared/http.js";

export function createApp({ config, services, pool = null }) {
  const app = express();
  const authenticate = createAuthenticate(config);

  app.disable("x-powered-by");
  app.set("etag", "weak");
  app.use(helmet());
  // Gzip/deflate para JSON > 1 KB (equivalente operativo a la pauta Brotli/Gzip de Green IT).
  app.use(compression({ threshold: 1024 }));
  app.use(cors({ origin: config.corsOrigin, credentials: false }));
  app.use(express.json({ limit: "100kb" }));
  app.use((request, response, next) => {
    if (request.method === "GET") {
      response.setHeader(
        "Cache-Control",
        "private, max-age=0, must-revalidate",
      );
    } else {
      response.setHeader("Cache-Control", "no-store");
    }
    next();
  });

  app.get("/health", (_request, response) =>
    response.json({
      data: {
        status: "ok",
        checkedAt: new Date().toISOString(),
        checks: { api: "ok" },
      },
    }),
  );

  app.get("/health/ready", async (_request, response) => {
    if (!pool) {
      return response.status(503).json({
        data: {
          status: "degraded",
          checkedAt: new Date().toISOString(),
          checks: { api: "ok", database: "unavailable" },
        },
      });
    }
    try {
      await pool.query("SELECT 1");
      return response.json({
        data: {
          status: "ok",
          checkedAt: new Date().toISOString(),
          checks: { api: "ok", database: "ok" },
        },
      });
    } catch {
      return response.status(503).json({
        data: {
          status: "degraded",
          checkedAt: new Date().toISOString(),
          checks: { api: "ok", database: "down" },
        },
      });
    }
  });
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
  app.use(
    "/api/indicators",
    createIndicatorsRouter({
      indicatorsService: services.indicatorsService,
      authenticate,
    }),
  );
  app.use(
    "/api/reports",
    createReportsRouter({
      reportsService: services.reportsService,
      authenticate,
    }),
  );
  app.use(
    "/api/optimizations",
    createOptimizationRouter({
      optimizationService: services.optimizationService,
      authenticate,
    }),
  );
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
