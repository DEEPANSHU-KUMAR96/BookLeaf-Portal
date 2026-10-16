import { z } from "zod";
import mongoose from "mongoose";
import { STATUSES } from "../models/ticket.model.js";

const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");

export const createTicketSchema = z.object({
    // null / omitted = "General / Account Level"
    bookId: objectId.nullish(),
    subject: z.string()
        .trim()
        .min(5, "Subject must be at least 5 characters").max(200),
    description: z
        .string()
        .trim()
        .min(20, "Please describe the issue in at least 20 characters")
        .max(5000),
    // UI-only for now: we store file names, not files
    attachments: z
        .array(z.object({ fileName: z.string().trim().min(1).max(255) }))
        .max(5, "You can attach up to 5 files")
        .default([]),
});

export const listTicketsQuerySchema = z.object({
    page: z.coerce.number()
        .int()
        .min(1)
        .default(1),
    limit: z.coerce.number()
        .int()
        .min(1)
        .max(50)
        .default(20),
    status: z.enum(STATUSES)
        .optional(),
});