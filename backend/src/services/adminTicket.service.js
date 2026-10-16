import mongoose from "mongoose";
import Ticket, { PRIORITIES } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex } from "../utils/escapeRegex.js";

const UNRESOLVED = ["Open", "In Progress"];
const OVERDUE_HOURS = 48; // matches the 48-hour resolution promise in our responses
const DAY_MS = 24 * 60 * 60 * 1000;

const SORTS = {
    // Unresolved first, then Critical -> Low, then oldest first
    urgency: { isUnresolved: -1, priorityRank: 1, createdAt: 1 },
    oldest: { createdAt: 1 },
    newest: { createdAt: -1 },
};

/** Adds age and overdue info so the admin UI can highlight stuck tickets. */
function withAge(ticket) {
    const ageHours = Math.floor((Date.now() - new Date(ticket.createdAt)) / 36e5);
    return {
        ...ticket,
        ageHours,
        isOverdue: UNRESOLVED.includes(ticket.status) && ageHours > OVERDUE_HOURS,
    };
}

/** "2026-10-16" parses to midnight UTC; treat it as the end of that day for the upper bound. */
function endOfDayIfDateOnly(date) {
    const isMidnight = date.getTime() % DAY_MS === 0;
    return isMidnight ? new Date(date.getTime() + DAY_MS - 1) : date;
}

export async function listTickets(admin, filters) {
    const { page, limit, status, category, priority, assignedTo, search, from, to, sort } = filters;

    const match = {};
    if (status) match.status = status;
    if (category) match.category = category;
    if (priority) match.priority = priority;
    if (assignedTo === "me") match.assignedTo = new mongoose.Types.ObjectId(admin.id);
    if (assignedTo === "unassigned") match.assignedTo = null;
    if (search) match.subject = new RegExp(escapeRegex(search), "i");
    if (from || to) {
        match.createdAt = {};
        if (from) match.createdAt.$gte = from;
        if (to) match.createdAt.$lte = endOfDayIfDateOnly(to);
    }

    const [rows, total] = await Promise.all([
        Ticket.aggregate([
            { $match: match },
            {
                $addFields: {
                    // Critical = 0, High = 1, Medium = 2, Low = 3, so ascending sort puts urgent first
                    priorityRank: {
                        $switch: {
                            branches: PRIORITIES.map((p, i) => ({ case: { $eq: ["$priority", p] }, then: i })),
                            default: PRIORITIES.length,
                        },
                    },
                    isUnresolved: { $cond: [{ $in: ["$status", UNRESOLVED] }, 1, 0] },
                },
            },
            { $sort: SORTS[sort] },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            // The queue only needs a summary, not full conversations
            {
                $project: {
                    subject: 1, status: 1, category: 1, categorySource: 1,
                    priority: 1, prioritySource: 1, author: 1, book: 1, assignedTo: 1,
                    createdAt: 1, updatedAt: 1,
                    responseCount: { $size: { $ifNull: ["$responses", []] } },
                    aiStatus: "$ai.status",
                },
            },
        ]),
        Ticket.countDocuments(match),
    ]);

    // aggregate() returns plain objects, so populate through the model
    await Ticket.populate(rows, [
        { path: "author", select: "authorId name email" },
        { path: "book", select: "bookId title" },
        { path: "assignedTo", select: "name email" },
    ]);

    return {
        tickets: rows.map(withAge),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}

/** Full admin view: internal notes, AI draft and people are all populated. */
export async function getTicket(id) {
    const ticket = await Ticket.findById(id)
        .populate("author", "authorId name email")
        .populate("book", "bookId title isbn status")
        .populate("assignedTo", "name email")
        .populate("internalNotes.admin", "name")
        .populate("responses.sender", "name");

    if (!ticket) {
        throw ApiError.notFound("Ticket not found")
    };
    return withAge(ticket.toObject());
}

export async function updateTicket(admin, id, input) {
    const set = {};
    if (input.status) set.status = input.status;
    // An admin override is recorded so the AI never overwrites it later
    if (input.category) Object.assign(set, {
         category: input.category, categorySource: "admin"
         });
    if (input.priority) Object.assign(set, { 
        priority: input.priority, prioritySource: "admin"
     });
    if ("assignedTo" in input) set.assignedTo = input.assignedTo === "me" ? admin.id : null;

    const updated = await Ticket.findByIdAndUpdate(id, { $set: set }, { runValidators: true });
    if (!updated) {
        throw ApiError.notFound("Ticket not found")
    };
    return getTicket(id);
}

export async function addNote(admin, id, text) {
    const updated = await Ticket.findByIdAndUpdate(id, {
        $push: { internalNotes: { admin: admin.id, text } }, // never exposed to authors
    });
    if (!updated) {
        throw ApiError.notFound("Ticket not found")

    };
    return getTicket(id);
}

export async function addResponse(admin, id, { message, aiAssisted }) {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        throw ApiError.notFound("Ticket not found")
    };
    if (ticket.status === "Closed") {
        {
            throw ApiError.conflict("This ticket is closed. Reopen it before replying")

        };
    }

    ticket.responses.push({
        sender: admin.id,
        senderRole: "admin",
        message,
        aiAssisted,
    });
    // Sensible defaults: replying means work has started and someone owns the ticket
    if (ticket.status === "Open") ticket.status = "In Progress";
    if (!ticket.assignedTo) ticket.assignedTo = admin.id;
    await ticket.save();

    // Step 8: emit a real-time event here so the author sees the reply instantly.
    return getTicket(id);
}