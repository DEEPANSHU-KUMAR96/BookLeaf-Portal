import { Router } from "express";
import { getOne, list } from "../controllers/book.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { listBooksQuerySchema } from "../validators/book.validator.js";

const router = Router();

// Both roles may call these;
//  the service scopes the data per role
router.use(authenticate);

router.get("/", validate(listBooksQuerySchema, "query"), list);
router.get("/:id", getOne);

export default router;