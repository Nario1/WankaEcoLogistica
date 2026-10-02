import { Router } from "express";
import { ROLES } from "../../shared/validation.js";
import { authorize } from "../auth/auth.middleware.js";
import { calculateEmissions } from "./emissions.service.js";

export function createEmissionsRouter({ authenticate }) {
  const router = Router();
  router.use(
    authenticate,
    authorize(ROLES.ADMIN, ROLES.OPERATOR, ROLES.AUDITOR),
  );
  router.post("/calculate", (request, response) => {
    response.json({ data: calculateEmissions(request.body) });
  });
  return router;
}
