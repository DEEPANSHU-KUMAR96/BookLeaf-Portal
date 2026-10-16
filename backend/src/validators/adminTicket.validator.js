import { z } from "zod";
import { STATUSES, CATEGORIES, PRIORITIES } from "../models/ticket.model.js";

export const adminListQuerySchema = z
    .object({
        page: z.coerce.number()
            .int()
            .min(1)
            .default(1),
        limit: z.coerce.number()
            .int()
            .min(1)
            .max(100)
            .default(20),
        status: z.enum(STATUSES)
            .optional(),
        category: z.enum(CATEGORIES)
            .optional(),
        priority: z.enum(PRIORITIES)
            .optional(),
        assignedTo: z.enum(["me", "unassigned"])
            .optional(),
        search: z.string()
            .trim()
            .max(100)
            .optional(), // matches subject
        from: z.coerce.date()
            .optional(), // createdAt >= from
        to: z.coerce.date()
            .optional(), // createdAt <= to (date-only values include the whole day)
        sort: z.enum(["urgency", "oldest", "newest"])
            .default("urgency"),
    })
    .refine((q) => !q.from || !q.to || q.from <= q.to, {
        message: "'from' must be before 'to'",
        path: ["from"],
    });

export const updateTicketSchema = z
    .object({
        status: z.enum(STATUSES)
            .optional(),
        category: z.enum(CATEGORIES)
            .optional(),
        priority: z.enum(PRIORITIES)
            .optional(),
        // "me" = assign to the calling admin, null = unassign
        assignedTo: z.literal("me")
            .nullable()
            .optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
        message: "Provide at least one field to update",
    });

export const addNoteSchema = z.object({
    text: z.string()
        .trim()
        .min(1, "Note cannot be empty")
        .max(2000),
});

export const sendResponseSchema = z.object({
    message: z.string()
        .trim()
        .min(1, "Response cannot be empty")
        .max(5000),
    // true when the admin sent the AI draft (edited or not). Used later for analytics.
    aiAssisted: z.boolean()
        .default(false),
});