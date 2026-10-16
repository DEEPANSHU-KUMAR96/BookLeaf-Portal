import { config } from "../config/config.js";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const COOKIE_NAME = "refreshToken";
const isProduction = process.env.NODE_ENV === "production";

// In production the frontend and API are usually on different domains,
// so the cookie must be SameSite=None + Secure. Locally Lax is enough.
const cookieOptions = {
    httpOnly: true, // not readable from JavaScript (protects against XSS)
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth", // cookie is only sent to auth endpoints
    maxAge: config.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(
        req.body.email,
        req.body.password
    );
    res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
    res.json({
        user,
        accessToken,
        message: "Logged in successfully",
    });
});

export const refresh = asyncHandler(async (req, res) => {
    try {
        const { accessToken, refreshToken } = await authService.refresh(req.cookies[COOKIE_NAME]);
        res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
        res.json({
            accessToken,
            message: "Refreshed access token",
        });
    } catch (err) {
        // Clear the dead cookie so the client stops retrying with it
        res.clearCookie(COOKIE_NAME, {
            ...cookieOptions,
            maxAge: undefined
        });
        throw err;
    }
});

export const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.cookies[COOKIE_NAME]);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
    res.json({
        message: "Logged out successfully"
    }).end();
});

export const me = asyncHandler(async (req, res) => {
    res.json({
        user: await authService.getProfile(req.user.id)
    });
});