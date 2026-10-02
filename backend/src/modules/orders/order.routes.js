import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { ROLES } from "../../shared/validation.js";
import { authorize } from "../auth/auth.middleware.js";

export function createOrderRouter({ orderService, authenticate }) {
  const router = Router();
  router.use(authenticate);

  router.get(
    "/",
    authorize(ROLES.ADMIN, ROLES.OPERATOR, ROLES.AUDITOR),
    asyncHandler(async (_request, response) =>
      response.json({ data: await orderService.list() }),
    ),
  );
  router.post(
    "/",
    authorize(ROLES.ADMIN, ROLES.OPERATOR),
    asyncHandler(async (request, response) => {
      const order = await orderService.create(request.body, request.user.id);
      response.status(201).json({ data: order });
    }),
  );
  router.patch(
    "/:id",
    authorize(ROLES.ADMIN, ROLES.OPERATOR),
    asyncHandler(async (request, response) => {
      response.json({
        data: await orderService.update(
          request.params.id,
          request.body,
          request.user.id,
        ),
      });
    }),
  );
  return router;
}
