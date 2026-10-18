import { escapeRegex } from "../src/utils/escapeRegex.js";
import { formatDate, royaltySchedule } from "../src/utils/royaltySchedule.js";

describe("escapeRegex", () => {
    test("escapes regular-expression metacharacters", () => {
        expect(escapeRegex("book (draft)+ [2026].*")).toBe("book \\(draft\\)\\+ \\[2026\\]\\.\\*");
    });

    test("leaves ordinary text unchanged", () => {
        expect(escapeRegex("BookLeaf")).toBe("BookLeaf");
    });
});

describe("royaltySchedule", () => {
    test("uses the previous quarter during its payout window", () => {
        const schedule = royaltySchedule(new Date("2026-04-15T00:00:00.000Z"));

        expect(schedule.periodEnd.toISOString()).toBe("2026-03-31T00:00:00.000Z");
        expect(schedule.payoutDueBy.toISOString()).toBe("2026-05-15T00:00:00.000Z");
    });

    test("moves to the current quarter after the previous payout window", () => {
        const schedule = royaltySchedule(new Date("2026-05-16T00:00:00.000Z"));

        expect(schedule.periodEnd.toISOString()).toBe("2026-06-30T00:00:00.000Z");
        expect(schedule.payoutDueBy.toISOString()).toBe("2026-08-14T00:00:00.000Z");
    });

    test("formats dates in the configured locale and handles empty values", () => {
        expect(formatDate("2026-01-05T00:00:00.000Z")).toBe("5 Jan 2026");
        expect(formatDate(null)).toBeNull();
    });
});
