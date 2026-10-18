import Ticket from "../../models/ticket.model.js";
import Author from "../../models/author.model.js";
import Book from "../../models/Book.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { classifyTicket } from "./classifier.service.js";
import { draftResponse } from "./drafter.service.js";
import { AiUnavailableError } from "./groq.client.js";
import { publish, ADMINS_ROOM } from "../realtime.service.js";


/**
 * Classifies a ticket and sets its priority.
 * Never throws: AI problems must not break ticket creation. Failures are
 * recorded on the ticket so admins can see them and retry.
 */
export async function processNewTicket(ticketId) {
    try {
        const ticket = await Ticket.findById(ticketId).populate({
            path: "book",
            select: "title status",
            model: Book,
        });
        if (!ticket) return;

        const result = await classifyTicket({
            subject: ticket.subject,
            description: ticket.description,
            book: ticket.book,
        });

        // Conditional updates: a value an admin already set is never overwritten
        await Ticket.updateOne(
            { _id: ticketId, categorySource: "default" },
            { category: result.category, categorySource: "ai" }
        );
        await Ticket.updateOne(
            { _id: ticketId, prioritySource: "default" },
            { priority: result.priority, prioritySource: "ai" }
        );
        await Ticket.updateOne(
            { _id: ticketId },
            { "ai.status": "done", "ai.reason": result.reason, "ai.error": null }
        );

        publish(ADMINS_ROOM, "ticket.updated", { ticketId, reason: "ai_classified" });
    } catch (err) {
        console.error(`[ai] classification failed for ticket ${ticketId}:`, err.message);

        try {
            await Ticket.updateOne(
                { _id: ticketId },
                { "ai.status": "failed", "ai.error": err.message }
            );
            publish(ADMINS_ROOM, "ticket.updated", { ticketId, reason: "ai_failed" });
        } catch (recordError) {
            console.error(
                `[ai] could not record classification failure for ticket ${ticketId}:`,
                recordError.message
            );
        }
    }
}

/** Returns the cached draft, or generates one. `force` regenerates it. */
export async function generateDraft(ticketId, { force = false } = {}) {
    const ticket = await Ticket.findById(ticketId)
        .populate({ path: "author", select: "name", model: Author })
        .populate({ path: "book", model: Book });
    if (!ticket) throw ApiError.notFound("Ticket not found");
    if (!ticket.author) throw new ApiError(409, "Ticket author no longer exists");

    if (ticket.ai?.draft && !force) return { draft: ticket.ai.draft, cached: true };

    try {
        const draft = await draftResponse({ ticket, author: ticket.author, book: ticket.book });
        await Ticket.updateOne(
            { _id: ticketId },
            { "ai.draft": draft, "ai.draftGeneratedAt": new Date(), "ai.status": "done", "ai.error": null }
        );
        return { draft, cached: false };
    } catch (err) {
        if (err instanceof AiUnavailableError) {
            console.error(`[ai] draft failed for ticket ${ticketId}:`, err.message);
            // 503 with a clear message: the admin UI falls back to the manual editor
            throw new ApiError(503, "AI draft is unavailable right now. You can write the response manually.");
        }
        throw err;
    }
}