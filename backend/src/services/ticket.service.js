import Ticket from "../models/ticket.model.js";
import { processNewTicket } from "./ai/ticketAi.service.js";
import Book from "../models/Book.model.js";
import { ApiError } from "../utils/ApiError.js";


/**
 * What an author is allowed to see. Whitelisting fields (instead of deleting
 * private ones) means a new internal field can never leak by accident.
 * Hidden on purpose: internalNotes, ai.*, priority, assignedTo, admin user ids.
 */
export function toAuthorView(ticket) {
    const t = ticket.toObject ? ticket.toObject() : ticket;
    return {
        id: t._id,
        subject: t.subject,
        description: t.description,
        attachments: t.attachments,
        status: t.status,
        category: t.category,
        book: t.book ?? null, // populated: { _id, bookId, title } or null for general
        responses: t.responses.map((r) => ({
            id: r._id,
            senderRole: r.senderRole,
            message: r.message,
            createdAt: r.createdAt,
        })),
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
    };
}

const BOOK_FIELDS = "bookId title";

export async function createTicket(user, input) {
    // The author can only attach a ticket to one of their own books
    if (input.bookId) {
        const owned = await Book.exists({
            _id: input.bookId, author: user.authorId
        });
        if (!owned) {
            throw ApiError.badRequest("Selected book was not found in your account")
        };
    }

    const ticket = await Ticket.create({
        author: user.authorId,
        book: input.bookId ?? null,
        subject: input.subject,
        description: input.description,
        attachments: input.attachments,
        // Step 7: AI classification + priority will be triggered from here.
        // The ticket is saved first so it is never lost if the AI provider is down.
    });
    // Fire and forget: the author gets their response immediately while the AI works
    // in the background. processNewTicket never throws, so nothing is left unhandled.
    void processNewTicket(ticket._id);
    await ticket.populate("book", BOOK_FIELDS);
    return toAuthorView(ticket);
}

export async function listMyTickets(user, { page, limit, status }) {
    const query = { author: user.authorId };
    if (status) query.status = status;

    const [tickets, total] = await Promise.all([
        Ticket.find(query)
            .populate("book", BOOK_FIELDS)
            .sort({ updatedAt: -1 }) // tickets with a fresh reply come first
            .skip((page - 1) * limit)
            .limit(limit),
        Ticket.countDocuments(query),
    ]);

    return {
        tickets: tickets.map(toAuthorView),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}

export async function getMyTicket(user, id) {
    const ticket = await Ticket.findOne({ _id: id, author: user.authorId }).populate(
        "book",
        BOOK_FIELDS
    );
    // 404 (not 403): do not reveal that a ticket id exists for someone else
    if (!ticket) {
        throw ApiError.notFound("Ticket not found")
    };
    return toAuthorView(ticket);
}