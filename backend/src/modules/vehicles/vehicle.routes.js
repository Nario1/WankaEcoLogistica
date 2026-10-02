import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { ROLES } from "../../shared/validation.js";
import { authorize } from "../auth/auth.middleware.js";

export function createVehicleRouter({ vehicleService, authenticate }) {
  const router = Router();
  router.use(authenticate);
  router.get(
    "/",
    authorize(ROLES.ADMIN, ROLES.OPERATOR, ROLES.AUDITOR),
    asyncHandler(async (_request, response) =>
      response.json({ data: await vehicleService.list() }),
    ),
  );
  router.post(
    "/",
    authorize(ROLES.ADMIN),
    asyncHandler(async (request, response) => {
      response.status(201).json({
        data: await vehicleService.create(request.body, request.user.id),
      });
    }),
  );
  router.patch(
    "/:id",
    authorize(ROLES.ADMIN),
    asyncHandler(async (request, response) => {
      response.json({
        data: await vehicleService.update(
          request.params.id,
          request.body,
          request.user.id,
        ),
      });
    }),
  );
  return router;
}
