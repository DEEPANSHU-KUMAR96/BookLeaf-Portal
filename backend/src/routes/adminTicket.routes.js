import { Router } from "express";
import { list, getOne, addNote, respond, update } from "../controllers/adminTicket.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { ROLES } from "../models/user.model.js";
import {
    adminListQuerySchema,
    updateTicketSchema,
    addNoteSchema,
    sendResponseSchema,
} from "../validators/adminTicket.validator.js";

const router = Router();

// Every route in this file is admin-only
router.use(authenticate, authorize(ROLES.ADMIN));

router.get("/", validate(adminListQuerySchema, "query"), list);
router.get("/:id", getOne);
router.patch("/:id", validate(updateTicketSchema), update);
router.post("/:id/notes", validate(addNoteSchema), addNote);
router.post("/:id/responses", validate(sendResponseSchema), respond);

export default router;