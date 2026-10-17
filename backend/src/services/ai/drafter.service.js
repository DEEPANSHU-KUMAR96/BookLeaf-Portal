import { config } from "../../config/config.js";
import { royaltySchedule, formatDate } from "../../utils/royaltySchedule.js";
import { chat } from "./groq.client.js";
import { draftSystemPrompt, draftUserMessage } from "./prompts.js";

const MIN_PAYOUT = 1000; // Rs, from the royalty policy

/**
 * Facts about the book, computed in code. The LLM only has to phrase them.
 * Handles books in production (no publication date, no sales) explicitly.
 */
export function buildBookFacts(book) {
    if (!book) return null;
    const published = book.status === "Published & Live";

    return {
        title: book.title,
        bookId: book.bookId,
        isbn: book.isbn,
        status: book.status,
        isPublished: published,
        publicationDate: formatDate(book.publicationDate), // null while in production
        printPartner: book.printPartner,
        availableOn: book.availableOn,
        ...(published && {
            mrpRs: book.mrp,
            royaltyPerCopyRs: book.authorRoyaltyPerCopy,
            copiesSold: book.totalCopiesSold,
            totalRoyaltyEarnedRs: book.totalRoyaltyEarned,
            royaltyPaidRs: book.royaltyPaid,
            royaltyPendingRs: book.royaltyPending,
            lastPayoutDate: formatDate(book.lastRoyaltyPayoutDate) ?? "no payout yet",
            pendingBelowMinimumThreshold: book.royaltyPending > 0 && book.royaltyPending < MIN_PAYOUT,
        }),
    };
}

export async function draftResponse({ ticket, author, book }) {
    const schedule = royaltySchedule();

    return chat({
        model: config.GROQ_DRAFT_MODEL,
        system: draftSystemPrompt(ticket.category ?? "General Inquiry"),
        user: draftUserMessage({
            firstName: author.name.split(" ")[0],
            today: formatDate(new Date()),
            category: ticket.category ?? "General Inquiry",
            bookFacts: buildBookFacts(book),
            schedule: {
                periodEnd: formatDate(schedule.periodEnd),
                payoutDueBy: formatDate(schedule.payoutDueBy),
            },
            ticket,
        }),
        temperature: 0.4, // a little variation so replies do not sound robotic
        maxTokens: 1500,
        label: "draft",
    });
}