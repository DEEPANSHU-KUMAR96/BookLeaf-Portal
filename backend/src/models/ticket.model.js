import mongoose from "mongoose";

const { Schema } = mongoose;

export const CATEGORIES = [
    "Royalty & Payments",
    "ISBN & Metadata Issues",
    "Printing & Quality",
    "Distribution & Availability",
    "Book Status & Production Updates",
    "General Inquiry",
];
export const PRIORITIES = ["Critical", "High", "Medium", "Low"];
export const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

const responseSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        senderRole: {
            type: String,
            enum: ["admin", "author"],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        aiAssisted: {
            type: Boolean,
            default: false
        }, // send by draft
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const noteSchema = new Schema(
    {
        admin: {
            type: Schema.Types.ObjectId,
            ref: "User", required: true
        },
        text: {
            type: String,
            required: true
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const ticketSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "Author",
            required: true,
            index: true
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book", default: null
        }, // null = General / Account Level
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        },
        attachments: [{ fileName: String }], // UI only for now

        status: {
            type: String,
            enum: STATUSES,
            default: "Open",
            index: true
        },
        category: {
            type: String,
            enum: CATEGORIES,
            default: null,
            index: true
        },
        categorySource: {
            type: String,
            enum: ["ai", "admin", "default"],
            default: "default"
        },
        priority: {
            type: String,
            enum: PRIORITIES,
            default: "Medium",
            index: true
        },
        prioritySource: {
            type: String,
            enum: ["ai", "admin", "default"],
            default: "default"
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User", default: null
        },
        responses: [responseSchema],
        internalNotes: [noteSchema],

        ai: {
            status: {
                type: String,
                enum: ["pending", "done", "failed"],
                default: "pending"
            },
            draft: {
                type: String,
                default: null
            },
            draftGeneratedAt: Date,
            error: String,
        },
    },
    { timestamps: true }
);

// Admin queue: status filter + oldest first
ticketSchema.index({ status: 1, createdAt: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket