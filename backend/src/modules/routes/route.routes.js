import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { ROLES } from "../../shared/validation.js";
import { authorize } from "../auth/auth.middleware.js";

export function createRouteRouter({ routeService, authenticate }) {
  const router = Router();
  router.use(authenticate);

  router.get(
    "/mine",
    authorize(ROLES.DRIVER),
    asyncHandler(async (request, response) =>
      response.json({ data: await routeService.listMine(request.user.id) }),
    ),
  );

  router.get(
    "/",
    authorize(ROLES.ADMIN, ROLES.OPERATOR),
    asyncHandler(async (_request, response) =>
      response.json({ data: await routeService.list() }),
    ),
  );
  router.get(
    "/:id",
    authorize(ROLES.ADMIN, ROLES.OPERATOR, ROLES.DRIVER),
    asyncHandler(async (request, response) =>
      response.json({
        data: await routeService.get(request.params.id, request.user),
      }),
    ),
  );
  router.get(
    "/:id/stops",
    authorize(ROLES.ADMIN, ROLES.OPERATOR, ROLES.DRIVER),
    asyncHandler(async (request, response) =>
      response.json({
        data: await routeService.listStops(request.params.id, request.user),
      }),
    ),
  );
  router.get(
    "/:id/navigation",
    authorize(ROLES.ADMIN, ROLES.OPERATOR, ROLES.DRIVER),
    asyncHandler(async (request, response) =>
      response.json({
        data: await routeService.getNavigation(
          request.params.id,
          request.user,
        ),
      }),
    ),
  );
  router.post(
    "/",
    authorize(ROLES.ADMIN, ROLES.OPERATOR),
    asyncHandler(async (request, response) => {
      response.status(201).json({
        data: await routeService.create(request.body, request.user.id),
      });
    }),
  );
  router.patch(
    "/:id",
    authorize(ROLES.ADMIN, ROLES.OPERATOR),
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
    authorize(ROLES.ADMIN, ROLES.OPERATOR),
    asyncHandler(async (request, response) =>
      response.json({
        data: await routeService.remove(request.params.id, request.user.id),
      }),
    ),
  );
  router.put(
    "/:id/driver",
    authorize(ROLES.ADMIN, ROLES.OPERATOR),
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
