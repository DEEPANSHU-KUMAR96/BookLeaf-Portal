import rateLimit from "express-rate-limit";

const MIN = 60 * 1000;

/** Builds a limiter that answers with our standard { error } JSON shape. */
const limiter = ({ windowMs, limit, message, ...rest }) =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7", // sends RateLimit and Retry-After headers
        legacyHeaders: false,
        handler: (req, res) => res.status(429).json({ error: message }),
        ...rest,
    });

// Broad safety net for every API route
export const globalLimiter = limiter({
    windowMs: 15 * MIN,
    limit: 300,
    message: "Too many requests. Please try again in a few minutes",
});

// Brute-force protection. Only failed logins count, so normal users are never locked out.
export const loginLimiter = limiter({
    windowMs: 15 * MIN,
    limit: 10,
    skipSuccessfulRequests: true,
    message: "Too many failed login attempts. Try again in 15 minutes",
});

// Each ticket triggers an AI call, so cap creation per author to control cost.
// Runs after authenticate(), so req.user is always set.
export const createTicketLimiter = limiter({
    windowMs: 60 * MIN,
    limit: 10,
    keyGenerator: (req) => req.user.id,
    message: "You have created too many tickets in the last hour. Please try again later",
});

// Explicit AI calls (draft / reclassify) cost tokens, so they get their own budget
export const aiLimiter = limiter({
    windowMs: 10 * MIN,
    limit: 20,
    keyGenerator: (req) => req.user.id,
    message: "AI request limit reached. Please wait a few minutes or write the response manually",
});