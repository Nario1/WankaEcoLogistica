import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { ROLES } from "../../shared/validation.js";
import { authorize } from "../auth/auth.middleware.js";

export function createRouteRouter({ routeService, authenticate }) {
  const router = Router();
  router.use(authenticate, authorize(ROLES.ADMIN, ROLES.OPERATOR));
  router.get(
    "/",
    asyncHandler(async (_request, response) =>
      response.json({ data: await routeService.list() }),
    ),
  );
  router.get(
    "/:id",
    asyncHandler(async (request, response) =>
      response.json({ data: await routeService.get(request.params.id) }),
    ),
  );
  router.get(
    "/:id/stops",
    asyncHandler(async (request, response) =>
      response.json({ data: await routeService.listStops(request.params.id) }),
    ),
  );
  router.get(
    "/:id/navigation",
    asyncHandler(async (request, response) =>
      response.json({
        data: await routeService.getNavigation(request.params.id),
      }),
    ),
  );
  router.post(
    "/",
    asyncHandler(async (request, response) => {
      response.status(201).json({
        data: await routeService.create(request.body, request.user.id),
      });
    }),
  );
  router.patch(
    "/:id",
    asyncHandler(async (request, response) =>
      response.json({
        data: await routeService.update(
          request.params.id,
          request.body,
          request.user.id,
        ),
      }),
    ),
  );
  router.delete(
    "/:id",
    asyncHandler(async (request, response) =>
      response.json({
        data: await routeService.remove(request.params.id, request.user.id),
      }),
    ),
  );
  router.put(
    "/:id/driver",
    asyncHandler(async (request, response) => {
      response.json({
        data: await routeService.assignDriver(
          request.params.id,
          request.body?.driverId,
          request.user.id,
        ),
      });
    }),
  );
  return router;
}
