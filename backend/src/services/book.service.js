import mongoose from "mongoose";
import Book from "../models/Book.model.js";
import { ROLES } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex } from "../utils/escapeRegex.js";

/**
 * Single place where data scoping happens:
 * authors are always locked to their own books, admins see everything.
 */
function scopeFor(user) {
    return user.role === ROLES.AUTHOR ? {
        author: user.authorId
    } : {};
}

export async function listBooks(user, filters) {
    const { page, limit, status, search, authorId } = filters;
    const isAdmin = user.role === ROLES.ADMIN;

    const query = { ...scopeFor(user) };
    if (isAdmin && authorId) query.author = authorId;
    if (status) query.status = status;
    if (search) {
        const rx = new RegExp(escapeRegex(search), "i");
        query.$or = [{ title: rx }, { isbn: rx }];
    }

    // aggregate() does not auto-cast strings to ObjectId, so cast manually
    const matchStage = { ...query };
    if (matchStage.author) matchStage.author = new mongoose.Types.ObjectId(matchStage.author);

    const [books, total, totals] = await Promise.all([
        Book.find(query)
            // Admins also need to know whose book it is
            .populate(isAdmin ? { path: "author", select: "authorId name email" } : "")
            .sort({ createdAt: 1, bookId: 1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Book.countDocuments(query),
        Book.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalCopiesSold: { $sum: "$totalCopiesSold" },
                    totalRoyaltyEarned: { $sum: "$totalRoyaltyEarned" },
                    royaltyPaid: { $sum: "$royaltyPaid" },
                    royaltyPending: { $sum: "$royaltyPending" },
                },
            },
        ]),
    ]);

    return {
        books,
        // Zeros when the author has no books yet: the UI can render an empty state safely
        summary: totals[0]
            ? (({ _id, ...rest }) => rest)(totals[0])
            : { totalCopiesSold: 0, totalRoyaltyEarned: 0, royaltyPaid: 0, royaltyPending: 0 },
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}

export async function getBook(user, id) {
    if (!mongoose.isValidObjectId(id)) {
        throw ApiError.badRequest("Invalid book id")
    };

    const isAdmin = user.role === ROLES.ADMIN;
    const book = await Book.findOne({ _id: id, ...scopeFor(user) }).populate(
        isAdmin ? { path: "author", select: "authorId name email" } : ""
    );

    // 404 (not 403) for other authors' books: do not reveal that the id exists
    if (!book) {
        throw ApiError.notFound("Book not found")
    };
    return book;
}