import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { ROLES } from "../../shared/validation.js";
import { authorize } from "../auth/auth.middleware.js";

export function createIndicatorsRouter({ indicatorsService, authenticate }) {
  const router = Router();
  router.use(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.OPERATOR, ROLES.AUDITOR),
  );

  router.get(
    "/",
    asyncHandler(async (request, response) =>
      response.json({ data: await indicatorsService.getForPeriod(request.query) }),
    ),
  );

  return router;
}
