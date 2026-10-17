import { Router } from "express";
import { create, getMine, listMine } from "../controllers/ticket.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { ROLES } from "../models/user.model.js";
import { createTicketSchema, listTicketsQuerySchema } from "../validators/ticket.validator.js";
import { createTicketLimiter } from "../middlewares/rateLimit.js";

const router = Router();

router.use(authenticate);

// Author-side endpoints. Admin ticket endpoints are added in Step 6.
router.post("/", authorize(ROLES.AUTHOR), validate(createTicketSchema), create);
router.get(
    "/",
    authorize(ROLES.AUTHOR),
    createTicketLimiter,
    validate(listTicketsQuerySchema, "query"),
    listMine
);
router.get("/:id", authorize(ROLES.AUTHOR), getMine);

export default router;