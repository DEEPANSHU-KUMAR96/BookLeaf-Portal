import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";

import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import adminTicketRoutes from "./routes/adminTicket.routes.js";
import eventsRoutes from "./routes/events.routes.js";

import swaggerUi from "swagger-ui-express";
import { openapi } from "./docs/openapi.js";
import { globalLimiter } from "./middlewares/rateLimit.js";

const app = express();

app.set("trust proxy", 1);

// Docs are mounted BEFORE helmet: Swagger UI uses inline scripts that helmet's default CSP blocks
app.get("/api/docs.json", (req, res) => res.json(openapi));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi, {
    customSiteTitle: "BookLeaf API Docs"
}));

app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: config.clientUrl,
    credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/admin/tickets", adminTicketRoutes);

app.use("/api/events", eventsRoutes);
app.use("/api", globalLimiter);

app.use(notFound);
app.use(errorHandler);

export default app;