import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { ROLES } from "../../shared/validation.js";
import { authorize } from "../auth/auth.middleware.js";

export function createOptimizationRouter({
  optimizationService,
  authenticate,
}) {
  const router = Router();
  router.use(authenticate, authorize(ROLES.ADMIN, ROLES.OPERATOR));
  router.post(
    "/",
    asyncHandler(async (request, response) => {
      response.status(201).json({
        data: await optimizationService.optimize(request.body, request.user.id),
      });
    }),
  );
  return router;
}
