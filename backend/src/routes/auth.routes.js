import { loginLimiter } from "../middlewares/rateLimit.js";

import { Router } from "express";

import { login, logout, me, refresh } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/refresh", refresh); // reads the refresh cookie
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;