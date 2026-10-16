import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import RefreshToken from "../models/RefreshToken.js";
import Author from "../models/author.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
    signAccessToken,
    issueRefreshToken,
    hashToken,
    revokeFamily,
} from "./token.service.js";

const publicUser = (u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    author: u.author ?? null,
});

export async function login(email, password) {
    const user = await User.findOne({ email }).select("+passwordHash");
    const valid = user && (await bcrypt.compare(password, user.passwordHash));
    // Same message for unknown email and wrong password: avoids leaking which emails exist
    if (!valid) {
        throw ApiError.unauthorized("Invalid email or password");
    }

    return {
        user: publicUser(user),
        accessToken: signAccessToken(user),
        refreshToken: await issueRefreshToken(user._id),
    };
}

/** Rotates the refresh token: old one is revoked, a new one is issued in the same family. */
export async function refresh(rawToken) {
    if (!rawToken) {
        throw ApiError.unauthorized("Missing refresh token")
    };

    const stored = await RefreshToken.findOne({
        tokenHash: hashToken(rawToken)
    });
    if (!stored) {
        throw ApiError.unauthorized("Invalid refresh token")
    };

    // A revoked token being reused means it may have been stolen: kill the whole session
    if (stored.revokedAt) {
        await revokeFamily(stored.family);
        throw ApiError.unauthorized("Refresh token reuse detected. Please log in again");
    }
    if (stored.expiresAt < new Date()) {
        throw ApiError.unauthorized("Refresh token expired")
    };

    const user = await User.findById(stored.user);
    if (!user) {
        throw ApiError.unauthorized("User no longer exists")
    };

    stored.revokedAt = new Date();
    await stored.save();

    return {
        accessToken: signAccessToken(user),
        refreshToken: await issueRefreshToken(user._id, stored.family),
    };
}

/** Logout is idempotent: an unknown or missing token is silently ignored. */
export async function logout(rawToken) {
    if (!rawToken) return;
    const stored = await RefreshToken.findOne({ tokenHash: hashToken(rawToken) });
    if (stored) await revokeFamily(stored.family);
}

export async function getProfile(userId) {
    const user = await User.findById(userId).populate({ path: "author", model: Author });
    if (!user) {
        throw ApiError.unauthorized("User no longer exists")

    };
    return { ...publicUser(user), authorProfile: user.author };
}