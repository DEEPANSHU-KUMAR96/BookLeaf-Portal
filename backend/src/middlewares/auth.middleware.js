import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { ApiError } from "../utils/ApiError.js";

/// Middleware to authenticate requests
export function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw ApiError.unauthorized("Missing access token");
    }

    try {
        const payload = jwt.verify(header.slice(7), config.JWT_SECRET);
        req.user = { id: payload.sub, role: payload.role, authorId: payload.author };
        next();
    } catch (err) {
        // Frontend uses this exact message to know when to call /auth/refresh
        throw ApiError.unauthorized(
            err.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token"
        );
    }
}

/** Role-based access control. Usage: authorize("admin") */
export const authorize =
    (...roles) =>
        (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                throw ApiError.forbidden("You do not have permission to access this resource");
            }
            next();
        };