import mongoose from "mongoose";

export const ROLES = { AUTHOR: "author", ADMIN: "admin" };

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author", default: null
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User