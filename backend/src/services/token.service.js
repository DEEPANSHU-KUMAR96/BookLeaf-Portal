import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { config } from "../config/config.js";
import RefreshToken from "../models/RefreshToken.js";

/** Short-lived JWT carrying just enough info to authorize a request without a DB hit. */
export function signAccessToken(user) {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            author: user.author ? user.author.toString() : null,
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
    );
}

export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

/** Creates an opaque refresh token, stores its hash, and returns the raw value. */
export async function issueRefreshToken(userId, family = crypto.randomUUID()) {
    const raw = crypto.randomBytes(40).toString("hex");
    await RefreshToken.create({
        user: userId,
        tokenHash: hashToken(raw),
        family,
        expiresAt: new Date(
            Date.now() + config.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
        ),
    });
    return raw;
}

export const revokeFamily = (family) =>
    RefreshToken.updateMany({
        family,
        revokedAt: null
    }, {
        revokedAt: new Date()
    });