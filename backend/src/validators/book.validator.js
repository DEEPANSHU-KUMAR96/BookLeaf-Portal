import { z } from "zod";
import mongoose from "mongoose";

export const listBooksQuerySchema = z.object({
    page: z.coerce.number()
        .int()
        .min(1)
        .default(1),
    limit: z.coerce.number()
        .int()
        .min(1)
        .max(100)
        .default(20),
    status: z.string()
        .trim()
        .max(100)
        .optional(),
    search: z.string()
        .trim()
        .max(100)
        .optional(), // matches title / ISBN
    authorId: z
        .string()
        .refine((v) => mongoose.isValidObjectId(v), "Invalid authorId")
        .optional(), // honoured for admins only
});