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

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/admin/tickets", adminTicketRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;