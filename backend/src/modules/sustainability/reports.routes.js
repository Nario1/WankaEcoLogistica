import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { ROLES } from "../../shared/validation.js";
import { authorize } from "../auth/auth.middleware.js";

export function createReportsRouter({ reportsService, authenticate }) {
  const router = Router();
  router.use(authenticate, authorize(ROLES.ADMIN, ROLES.AUDITOR));

  router.get(
    "/export",
    asyncHandler(async (request, response) => {
      const file = await reportsService.export(request.query, request.user.id);
      response.setHeader("Content-Type", file.contentType);
      response.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.filename}"`,
      );
      response.send(file.body);
    }),
  );

  return router;
}
