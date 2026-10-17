const DAY = 24 * 60 * 60 * 1000;
const PAYOUT_WINDOW_DAYS = 45;

// Last day of quarter q (0-3) in the given year, in UTC
const quarterEnd = (year, q) => new Date(Date.UTC(year, q * 3 + 3, 0));

/**
 * Policy: royalties are calculated quarterly and paid within 45 days of quarter end.
 * Returns the payout that is coming up next, computed in code so the LLM never does date math.
 */
export function royaltySchedule(now = new Date()) {
    const year = now.getUTCFullYear();
    const q = Math.floor(now.getUTCMonth() / 3);

    // The quarter that ended most recently
    const prevQ = (q + 3) % 4;
    const prevYear = q === 0 ? year - 1 : year;
    const lastEnd = quarterEnd(prevYear, prevQ);
    const lastDeadline = new Date(lastEnd.getTime() + PAYOUT_WINDOW_DAYS * DAY);

    // Still inside the 45-day window for the last quarter
    if (lastDeadline >= now) return { periodEnd: lastEnd, payoutDueBy: lastDeadline };

    // Otherwise the next payout belongs to the current quarter
    const currentEnd = quarterEnd(year, q);
    return {
        periodEnd: currentEnd,
        payoutDueBy: new Date(currentEnd.getTime() + PAYOUT_WINDOW_DAYS * DAY),
    };
}

export const formatDate = (d) =>
    d
        ? new Date(d).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
        })
        : null;