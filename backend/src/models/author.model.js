import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
    {
        authorId: {
            type: String,
            required: true,
            unique: true
        }, // AUTH001
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        phone: String,
        city: String,
        joinedDate: Date,
    },
    { timestamps: true }
);

const Author = mongoose.model("Author", authorSchema);

export default Author