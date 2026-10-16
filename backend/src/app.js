import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/config.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));

// Routes yaha mount honge (next steps me)

app.use(notFound);
app.use(errorHandler);

export default app;