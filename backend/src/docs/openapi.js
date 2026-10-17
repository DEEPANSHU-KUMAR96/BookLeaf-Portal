import { STATUSES, CATEGORIES, PRIORITIES } from "../models/ticket.model.js";

// ---- small helpers to keep the spec readable ----
const json = (schema) => ({ "application/json": { schema } });
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const err = (description) => ({ description, content: json(ref("Error")) });
const ok = (description, schema) => ({ description, ...(schema && { content: json(schema) }) });
const secured = [{ bearerAuth: [] }];

const id = { name: "id", in: "path", required: true, schema: { type: "string" }, description: "MongoDB ObjectId" };
const q = (name, schema, description) => ({ name, in: "query", schema, description });
const page = [
    q("page", { type: "integer", minimum: 1, default: 1 }),
    q("limit", { type: "integer", minimum: 1, maximum: 100, default: 20 }),
];

// Responses shared by most endpoints
const common = {
    400: err("Validation failed"),
    401: err("Missing, invalid or expired access token"),
    429: err("Rate limit exceeded"),
};
const admin = { ...common, 403: err("Admin role required") };

export const openapi = {
    openapi: "3.0.3",
    info: {
        title: "BookLeaf Author Support Portal API",
        version: "1.0.0",
        description:
            "REST API for the author and admin portals.\n\n" +
            "**How to authorize:** call `POST /auth/login`, copy `accessToken`, click **Authorize** and paste it. " +
            "Access tokens last 15 minutes; renew with `POST /auth/refresh` (httpOnly cookie).\n\n" +
            "**Errors** always look like `{ \"error\": \"message\", \"details\": [...] }`.",
    },
    servers: [{ url: "/api" }],
    tags: [
        { name: "Auth" }, { name: "Books" }, { name: "Author Tickets" },
        { name: "Admin Tickets" }, { name: "Realtime" }, { name: "System" },
    ],
    components: {
        securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
        schemas: {
            Error: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    details: { type: "array", items: { type: "object", properties: { field: { type: "string" }, message: { type: "string" } } } },
                },
            },
            Pagination: {
                type: "object",
                properties: { page: { type: "integer" }, limit: { type: "integer" }, total: { type: "integer" }, totalPages: { type: "integer" } },
            },
            Book: {
                type: "object",
                properties: {
                    _id: { type: "string" }, bookId: { type: "string", example: "BK001" }, title: { type: "string" },
                    isbn: { type: "string" }, genre: { type: "string" },
                    publicationDate: { type: "string", format: "date-time", nullable: true, description: "null while in production" },
                    status: { type: "string", example: "Published & Live" }, isPublished: { type: "boolean" },
                    mrp: { type: "number" }, totalCopiesSold: { type: "number" }, totalRoyaltyEarned: { type: "number" },
                    royaltyPaid: { type: "number" }, royaltyPending: { type: "number" },
                },
            },
            AuthorTicket: {
                type: "object",
                description: "Author view. Priority, AI data and internal notes are never included.",
                properties: {
                    id: { type: "string" }, subject: { type: "string" }, description: { type: "string" },
                    status: { type: "string", enum: STATUSES }, category: { type: "string", enum: CATEGORIES, nullable: true },
                    book: { type: "object", nullable: true, description: "null = General / Account Level" },
                    responses: { type: "array", items: { type: "object", properties: { id: { type: "string" }, senderRole: { type: "string" }, message: { type: "string" }, createdAt: { type: "string" } } } },
                    createdAt: { type: "string" }, updatedAt: { type: "string" },
                },
            },
            AdminTicket: {
                type: "object",
                description: "Full admin view with priority, AI fields, assignment and internal notes.",
                properties: {
                    _id: { type: "string" }, subject: { type: "string" }, status: { type: "string", enum: STATUSES },
                    category: { type: "string", enum: CATEGORIES }, categorySource: { type: "string", enum: ["ai", "admin", "default"] },
                    priority: { type: "string", enum: PRIORITIES }, prioritySource: { type: "string", enum: ["ai", "admin", "default"] },
                    ageHours: { type: "integer" }, isOverdue: { type: "boolean", description: "Unresolved for more than 48 hours" },
                    ai: { type: "object", properties: { status: { type: "string", enum: ["pending", "done", "failed"] }, reason: { type: "string" }, draft: { type: "string", nullable: true } } },
                },
            },
        },
    },
    paths: {
        "/health": { get: { tags: ["System"], summary: "Health check", responses: { 200: ok("Server is up") } } },

        // ---------- Auth ----------
        "/auth/login": {
            post: {
                tags: ["Auth"], summary: "Log in with email and password",
                description: "Returns an access token. Also sets the refresh token as an httpOnly cookie. Limited to 10 failed attempts per 15 minutes.",
                requestBody: { required: true, content: json({ type: "object", required: ["email", "password"], properties: { email: { type: "string", example: "priya.sharma@email.com" }, password: { type: "string", example: "Author@123" } } }) },
                responses: { 200: ok("Logged in"), 400: err("Validation failed"), 401: err("Invalid email or password"), 429: err("Too many failed attempts") },
            },
        },
        "/auth/refresh": {
            post: { tags: ["Auth"], summary: "Rotate the refresh token and get a new access token", description: "Reads the refresh token from the httpOnly cookie. Reusing an old token revokes the whole session.", responses: { 200: ok("New access token"), 401: err("Invalid, expired or reused refresh token") } },
        },
        "/auth/logout": { post: { tags: ["Auth"], summary: "Log out and revoke the session", responses: { 204: ok("Logged out") } } },
        "/auth/me": { get: { tags: ["Auth"], summary: "Current user profile", security: secured, responses: { 200: ok("Profile"), 401: common[401] } } },

        // ---------- Books ----------
        "/books": {
            get: {
                tags: ["Books"], security: secured,
                summary: "List books",
                description: "Authors always get only their own books. Admins get all books and may filter by `authorId`. Includes royalty totals.",
                parameters: [...page, q("status", { type: "string" }), q("search", { type: "string" }, "Matches title or ISBN"), q("authorId", { type: "string" }, "Admin only")],
                responses: { 200: ok("Books with summary and pagination", { type: "object", properties: { books: { type: "array", items: ref("Book") }, summary: { type: "object" }, pagination: ref("Pagination") } }), ...common },
            },
        },
        "/books/{id}": {
            get: { tags: ["Books"], security: secured, summary: "Get one book", parameters: [id], responses: { 200: ok("Book", ref("Book")), 404: err("Book not found (also returned for another author's book)"), ...common } },
        },

        // ---------- Author tickets ----------
        "/tickets": {
            post: {
                tags: ["Author Tickets"], security: secured, summary: "Raise a support ticket (author only)",
                description: "The ticket is saved first; AI classification runs in the background and never blocks creation. Limited to 10 tickets per hour.",
                requestBody: { required: true, content: json({ type: "object", required: ["subject", "description"], properties: { bookId: { type: "string", nullable: true, description: "null or omitted = General / Account Level" }, subject: { type: "string", minLength: 5, maxLength: 200 }, description: { type: "string", minLength: 20, maxLength: 5000 }, attachments: { type: "array", maxItems: 5, items: { type: "object", properties: { fileName: { type: "string" } } } } } }) },
                responses: { 201: ok("Ticket created", ref("AuthorTicket")), 403: err("Authors only"), ...common },
            },
            get: { tags: ["Author Tickets"], security: secured, summary: "List my tickets (author only)", parameters: [...page, q("status", { type: "string", enum: STATUSES })], responses: { 200: ok("Tickets with pagination"), 403: err("Authors only"), ...common } },
        },
        "/tickets/{id}": {
            get: { tags: ["Author Tickets"], security: secured, summary: "Get one of my tickets with admin responses", parameters: [id], responses: { 200: ok("Ticket", ref("AuthorTicket")), 404: err("Ticket not found"), ...common } },
        },

        // ---------- Admin tickets ----------
        "/admin/tickets": {
            get: {
                tags: ["Admin Tickets"], security: secured, summary: "Ticket queue",
                description: "Default sort is `urgency`: unresolved first, then Critical to Low, then oldest first.",
                parameters: [
                    ...page,
                    q("status", { type: "string", enum: STATUSES }), q("category", { type: "string", enum: CATEGORIES }),
                    q("priority", { type: "string", enum: PRIORITIES }), q("assignedTo", { type: "string", enum: ["me", "unassigned"] }),
                    q("search", { type: "string" }, "Matches subject"), q("from", { type: "string", format: "date" }), q("to", { type: "string", format: "date" }),
                    q("sort", { type: "string", enum: ["urgency", "oldest", "newest"], default: "urgency" }),
                ],
                responses: { 200: ok("Tickets with pagination"), ...admin },
            },
        },
        "/admin/tickets/{id}": {
            get: { tags: ["Admin Tickets"], security: secured, summary: "Full ticket detail", parameters: [id], responses: { 200: ok("Ticket", ref("AdminTicket")), 404: err("Ticket not found"), ...admin } },
            patch: {
                tags: ["Admin Tickets"], security: secured, summary: "Update status, category, priority or assignment",
                description: "Changing category or priority records an admin override that the AI never overwrites.",
                parameters: [id],
                requestBody: { required: true, content: json({ type: "object", properties: { status: { type: "string", enum: STATUSES }, category: { type: "string", enum: CATEGORIES }, priority: { type: "string", enum: PRIORITIES }, assignedTo: { type: "string", enum: ["me"], nullable: true, description: "\"me\" assigns to yourself, null unassigns" } } }) },
                responses: { 200: ok("Updated ticket", ref("AdminTicket")), 404: err("Ticket not found"), ...admin },
            },
        },
        "/admin/tickets/{id}/notes": {
            post: { tags: ["Admin Tickets"], security: secured, summary: "Add an internal note (never visible to the author)", parameters: [id], requestBody: { required: true, content: json({ type: "object", required: ["text"], properties: { text: { type: "string", maxLength: 2000 } } }) }, responses: { 201: ok("Updated ticket"), 404: err("Ticket not found"), ...admin } },
        },
        "/admin/tickets/{id}/responses": {
            post: {
                tags: ["Admin Tickets"], security: secured, summary: "Send a response to the author",
                description: "Moves an Open ticket to In Progress and assigns it to you if unassigned. Pushes a real-time event to the author.",
                parameters: [id],
                requestBody: { required: true, content: json({ type: "object", required: ["message"], properties: { message: { type: "string", maxLength: 5000 }, aiAssisted: { type: "boolean", default: false } } }) },
                responses: { 201: ok("Updated ticket"), 404: err("Ticket not found"), 409: err("Ticket is closed"), ...admin },
            },
        },
        "/admin/tickets/{id}/ai-draft": {
            post: {
                tags: ["Admin Tickets"], security: secured, summary: "Get the AI-drafted response",
                description: "Returns the cached draft, or generates one. Use `force=true` to regenerate. Returns 503 when the AI provider is unavailable so the UI can fall back to manual writing.",
                parameters: [id, q("force", { type: "boolean", default: false })],
                responses: { 200: ok("Draft", { type: "object", properties: { draft: { type: "string" }, cached: { type: "boolean" } } }), 404: err("Ticket not found"), 503: err("AI unavailable, write the response manually"), ...admin },
            },
        },
        "/admin/tickets/{id}/ai-classify": {
            post: { tags: ["Admin Tickets"], security: secured, summary: "Re-run AI classification and priority", description: "Useful after an AI failure. Values already set by an admin are preserved.", parameters: [id], responses: { 200: ok("Updated ticket", ref("AdminTicket")), 404: err("Ticket not found"), ...admin } },
        },

        // ---------- Realtime ----------
        "/events": {
            get: {
                tags: ["Realtime"], security: secured, summary: "Server-Sent Events stream",
                description: "Authors receive `ticket.response` and `ticket.updated` (status only) for their own tickets. Admins receive `ticket.created` and `ticket.updated`. Events carry only ids; refetch the ticket through the normal endpoint. The stream closes when the access token expires, so reconnect with a fresh token. Swagger UI cannot display streams; test with `curl.exe -N`.",
                responses: { 200: { description: "text/event-stream", content: { "text/event-stream": { schema: { type: "string" } } } }, 401: common[401] },
            },
        },
    },
};