const testEnvironment = {
    PORT: "3000",
    JWT_SECRET: "jest-test-jwt-secret",
    JWT_EXPIRES_IN: "1h",
    MONGO_URI: "mongodb://127.0.0.1:27017/bookleaf-test",
    GROQ_API_KEY: "jest-test-groq-key",
    GROQ_CLASSIFY_MODEL: "test-classify-model",
    GROQ_DRAFT_MODEL: "test-draft-model",
    CLIENT_URL: "http://localhost:5173",
    REFRESH_TOKEN_SECRET: "jest-test-refresh-secret",
    REFRESH_TOKEN_EXPIRES_DAYS: "7",
};

for (const [key, value] of Object.entries(testEnvironment)) {
    process.env[key] ??= value;
}
