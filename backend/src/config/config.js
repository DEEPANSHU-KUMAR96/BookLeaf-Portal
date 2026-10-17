import "dotenv/config";

if (!process.env.PORT) {
    throw new Error("PORT is not defined");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

if (!process.env.JWT_EXPIRES_IN) {
    throw new Error("JWT_EXPIRES_IN is not defined");
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined");
}
if (!process.env.GROQ_CLASSIFY_MODEL) {
    throw new Error("GROQ_CLASSIFY_MODEL is not defined");
}
if (!process.env.GROQ_DRAFT_MODEL) {
    throw new Error("GROQ_DRAFT_MODEL is not defined");
}

if (!process.env.CLIENT_URL) {
    throw new Error("CLIENT_URL is not defined");
}

if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

if (!process.env.REFRESH_TOKEN_EXPIRES_DAYS) {
    throw new Error("REFRESH_TOKEN_EXPIRES_DAYS is not defined");
}

const refreshTokenExpiresDays = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS);
if (!Number.isFinite(refreshTokenExpiresDays) || refreshTokenExpiresDays <= 0) {
    throw new Error("REFRESH_TOKEN_EXPIRES_DAYS must be a positive number of days");
}


export const config = {
    PORT: process.env.PORT || 8000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_DAYS: refreshTokenExpiresDays,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_CLASSIFY_MODEL: process.env.GROQ_CLASSIFY_MODEL || "llama-3.1-8b-instant",
    GROQ_DRAFT_MODEL: process.env.GROQ_DRAFT_MODEL || "llama-3.3-70b-versatile",
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};