import { listBooksQuerySchema } from "../src/validators/book.validator.js";
import { loginSchema } from "../src/validators/auth.validator.js";

describe("loginSchema", () => {
    test("normalizes valid credentials", () => {
        expect(loginSchema.parse({ email: "  READER@EXAMPLE.COM ", password: "secret" })).toEqual({
            email: "reader@example.com",
            password: "secret",
        });
    });

    test("rejects malformed email and missing password", () => {
        expect(loginSchema.safeParse({ email: "not-an-email", password: "" }).success).toBe(false);
    });
});

describe("listBooksQuerySchema", () => {
    test("coerces pagination values and applies defaults", () => {
        expect(listBooksQuerySchema.parse({ page: "2", limit: "25" })).toEqual({
            page: 2,
            limit: 25,
        });
    });

    test("rejects limits above the maximum and malformed author IDs", () => {
        expect(listBooksQuerySchema.safeParse({ limit: "101" }).success).toBe(false);
        expect(listBooksQuerySchema.safeParse({ authorId: "not-an-object-id" }).success).toBe(false);
    });
});
