import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        // SHA-256 hash of the raw token. The raw token is never stored.
        tokenHash: {
            type: String,
            required: true,
            unique: true
        },
        // All tokens issued from one login share a family, 
        // so we can revoke a whole session
        family: {
            type: String,
            required: true,
            index: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        revokedAt: {
            type: Date,
            default: null
        },
    },
    { timestamps: true }
);

// MongoDB automatically deletes expired documents (TTL index)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken