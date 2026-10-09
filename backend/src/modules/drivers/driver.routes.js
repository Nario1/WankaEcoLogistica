import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { ROLES } from "../../shared/validation.js";
import { authorize } from "../auth/auth.middleware.js";

export function createDriverRouter({ driverService, authenticate }) {
  const router = Router();
  router.use(authenticate, authorize(ROLES.ADMIN, ROLES.OPERATOR));
  router.get(
    "/",
    asyncHandler(async (_request, response) =>
      response.json({ data: await driverService.list() }),
    ),
  );
  router.get(
    "/:id",
    asyncHandler(async (request, response) =>
      response.json({ data: await driverService.get(request.params.id) }),
    ),
  );
  router.post(
    "/",
    authorize(ROLES.ADMIN),
    asyncHandler(async (request, response) => {
      response.status(201).json({
        data: await driverService.create(request.body, request.user.id),
      });
    }),
  );
  router.patch(
    "/:id",
    authorize(ROLES.ADMIN),
    asyncHandler(async (request, response) =>
      response.json({
        data: await driverService.update(
          request.params.id,
          request.body,
          request.user.id,
        ),
      }),
    ),
  );
  router.delete(
    "/:id",
    authorize(ROLES.ADMIN),
    asyncHandler(async (request, response) =>
      response.json({
        data: await driverService.remove(request.params.id, request.user.id),
      }),
    ),
  );
  return router;
}
