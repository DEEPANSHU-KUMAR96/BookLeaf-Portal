import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
    next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(err, req, res, next) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Validation failed",
            details: err.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message
            })),
        });
    }
    if (err.name === "CastError") {
        return res.status(400).json({
            error: `Invalid ${err.path}`
        });
    }
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            error: err.message,
            details: err.details
        });
    }
    console.error(err);
    res.status(500).json({
        error: "Internal server error"
    });
}