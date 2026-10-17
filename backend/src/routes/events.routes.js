import { Router } from "express";
import { stream } from "../controllers/events.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Both roles may subscribe; the controller picks the room from the token
router.get("/", authenticate, stream);

export default router;