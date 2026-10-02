import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";

export function createAuthRouter({ authService }) {
  const router = Router();

  router.post(
    "/login",
    asyncHandler(async (request, response) => {
      const result = await authService.login(request.body, { ip: request.ip });
      response.json({ data: result });
    }),
  );

  return router;
}
