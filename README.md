# BookLeaf Author Support Portal

A full-stack support and publishing portal for BookLeaf authors and support administrators. Authors can review their books and royalty information, submit and track support tickets, and receive updates as tickets change. Administrators can triage the shared ticket queue, collaborate with internal notes, respond to authors, and use AI-assisted classification and reply drafts.

**Live application:** [book-leaf-portal-seven.vercel.app](https://book-leaf-portal-seven.vercel.app)  
**API reference:** `/api/docs` on the backend deployment (local: [http://localhost:3000/api/docs](http://localhost:3000/api/docs))  
**Health check:** `/api/health` on the backend deployment (local: [http://localhost:3000/api/health](http://localhost:3000/api/health))

> This repository includes seeded demonstration accounts. Use them only in the demo environment; never use these passwords for a production account.

## Product capabilities

### Author portal

- View books, publication status, sales and royalty summaries.
- Submit support requests linked to a book or to the author account generally.
- View ticket status, category, and the conversation with support.
- Receive ticket changes in real time while connected.

### Administrator portal

- Triage, search, filter, and paginate the support queue.
- Review ticket age and priority, assign and update tickets, and manage their status.
- Add private internal notes that are not exposed in author-facing ticket responses.
- Reply to an author and optionally use an AI-generated draft.
- Review or retry AI classification when processing fails.

### Service and security

- REST API with request validation, role-based authorization, error responses, rate limits, and interactive OpenAPI documentation.
- Short-lived access tokens and rotating, revocable refresh tokens.
- Server-sent events (SSE) for ticket updates.
- Groq-powered ticket classification and contextual response drafting.

## Demo access

The seeded demo data creates the following accounts:

| Role | Email | Password |
| --- | --- | --- |
| Author (Priya Sharma) | `priya.sharma@email.com` | `Author@123` |
| Administrator | `admin@bookleaf.com` | `Admin@123` |

These are the credentials defined by the local seed script. They work on the live demo only while its database contains compatible seeded users. The seed script assigns `Author@123` to every seeded author.

> **Seed data warning:** `npm run seed` deletes existing documents from the `User`, `Author`, `Book`, and `Ticket` collections before loading sample data. Only run it against a disposable local/test database. It is not a production migration or safe reset command.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Redux Toolkit, Axios, Tailwind CSS |
| Backend | Node.js, Express, Mongoose, Zod |
| Database | MongoDB |
| Authentication | JWT access tokens, opaque refresh tokens, httpOnly cookies, bcryptjs |
| AI | Groq API, Llama 3.1 8B Instant, Llama 3.3 70B Versatile |
| API docs | OpenAPI 3, Swagger UI |
| Testing | Jest, Supertest |

## Architecture

### Layered backend

The Express backend keeps HTTP concerns separate from application logic:

1. **Routes** bind API paths to middleware and controllers.
2. **Middleware** handles authentication, role checks, request validation, and rate limiting.
3. **Controllers** translate HTTP requests/responses and call services.
4. **Services** implement auth, ticket, book, token, AI, and realtime behavior.
5. **Mongoose models** own persistence schemas and indexes.

This structure keeps API behavior in the controllers and business logic in reusable services rather than coupling all behavior to route handlers.

### MongoDB model choices

- `User` represents the login identity and role (`author` or `admin`); its password is stored as a bcrypt hash and excluded from normal query results.
- `Author` contains author profile information. `Book` references its author and stores publication and royalty totals.
- `Ticket` references its author and optional book. It embeds `responses` and `internalNotes` as subdocuments because both are ticket-owned history that is normally read and updated with the ticket. This avoids extra collections and keeps the conversation and its notes together.
- Each embedded response records the sender and role; each internal note records its administrator. The API returns different views for authors and admins so private notes and operational AI fields are not exposed to authors.
- Refresh-token records are stored separately so they can be hashed, revoked by session family, and automatically removed after expiry using a MongoDB TTL index.

### SSE instead of WebSockets

The browser subscribes to an authenticated SSE endpoint and the backend publishes named events when tickets are created or updated. This is a good fit for the app's one-way realtime requirement (server-to-browser notifications); normal interactions still use REST. SSE uses a standard HTTP connection and does not require a separate bidirectional messaging protocol.

The current publisher stores subscribers in process memory. It is intentionally simple for a single backend instance, but events are not shared across multiple instances and are lost on restart. See [Known limitations](#known-limitations).

### Authentication and refresh-token rotation

- Login returns a short-lived signed access token and sets an opaque refresh token in an `httpOnly` cookie.
- The frontend keeps the access token in memory, not `localStorage`; browser JavaScript cannot read the refresh cookie.
- The server stores a SHA-256 hash of each refresh token, not its raw value.
- Refresh exchanges a valid token for a new token in the same family. Reuse of a rotated token is treated as suspicious and revokes that family.
- Refresh-token records expire through a MongoDB TTL index. Logout revokes the session.

### Frontend state

Redux Toolkit slices hold authentication, books, author tickets, and administrator queue state. Feature services use a shared Axios client for API requests. The client coordinates concurrent refresh attempts through a single shared promise, avoiding competing refresh-token rotations. Server updates arrive through the realtime hook and are reflected in the relevant views.

## AI integration

AI is used for operational assistance, not as the source of business records:

- **Classification:** one structured JSON completion predicts a ticket category and priority together. The result is validated against application enums before it is stored. Admin-entered category or priority values are not overwritten.
- **Contextual drafting:** the draft prompt contains the ticket, author name, applicable policy material, and relevant book facts. Admins can review/edit a draft before sending a response.
- **Category-specific knowledge:** the knowledge base is split by ticket category (for example, royalties, ISBN/metadata, printing, distribution, production, or general inquiries). Draft requests receive only the matching section, along with shared company and tone guidance, rather than the entire KB.
- **Computed facts:** book values, payout totals, dates, and eligibility facts are assembled from MongoDB data in application code. The model is asked to phrase those facts, not calculate authoritative financial values.
- **Prompt-injection handling:** ticket content is treated as untrusted user data. System prompts explicitly instruct the model not to follow instructions embedded in tickets, change policy, or disclose internal notes. Model output is still constrained/validated where structured output is expected.
- **Caching:** a generated draft is stored on its ticket and returned on subsequent requests unless an admin explicitly forces regeneration. Classification is not cached as a separate result; its accepted values and processing state are persisted on the ticket.
- **Why Groq and two models:** Groq provides a managed chat-completions API and SDK, so this project can use Llama models without operating GPU inference infrastructure. The classification model, `llama-3.1-8b-instant`, is a sensible fit for constrained, enum-based triage; the more capable `llama-3.3-70b-versatile` is reserved for author-facing language that benefits from stronger instruction following and contextual composition. Keeping the model names configurable makes the provider/model choice replaceable. This trade-off avoids self-hosting but makes AI features dependent on the provider's availability, quotas, and current model catalog.
- **Cost visibility:** each Groq completion logs the model name and prompt/completion token counts. This is token-usage logging, not a billing ledger.
- **Graceful degradation:** classification failure is logged and recorded on the ticket so an administrator can retry. Draft generation reports that AI is unavailable and the admin can continue with the manual response editor. AI failure does not prevent ticket creation.

Model names are configurable through environment variables. Provider availability, model lifecycle, account quotas, latency, and pricing can change; verify current Groq availability before deploying.

## Local development

### Prerequisites

- Node.js 20 or newer (the CI workflow currently uses Node.js 24).
- npm.
- A MongoDB database, local or hosted.
- A Groq API key for AI classification and drafting. The API key stays on the backend and must never be placed in a `VITE_*` variable.

### 1. Clone and install

```bash
git clone https://github.com/DEEPANSHU-KUMAR96/BookLeaf-Portal.git
cd BookLeaf-Portal

cd backend
npm ci
cd ../frontend
npm ci
```

### 2. Configure the backend

Copy `backend/.env.example` to `backend/.env`, then set `MONGO_URI`, `GROQ_API_KEY`, and strong, unique development secrets for both token secrets. The backend requires these variables at startup.

```bash
cd backend
npm run dev
```

The backend listens on `http://localhost:3000` with the example configuration.

### 3. Configure the frontend

Copy `frontend/.env.example` to `frontend/.env`. The default `VITE_API_URL=/api` uses the Vite development proxy, which forwards API requests to `http://localhost:3000`.

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

If your local backend uses a different host or port, update the proxy target in `frontend/vite.config.js`. For a separately hosted API, set `VITE_API_URL` to that API's base URL including `/api`, and configure the backend's `CLIENT_URL` to the frontend origin.

### 4. Load sample data (optional)

Configure the backend to use a disposable database, then run:

```bash
cd backend
npm run seed
```

The seed script creates one administrator and sample authors/books. It **deletes existing documents** from the app's user, author, book, and ticket collections before inserting the sample set. Do not point it at production or any database containing data you need.

## Environment variables

The templates are [backend/.env.example](./backend/.env.example) and [frontend/.env.example](./frontend/.env.example). Copy them to `.env` in the corresponding app directory and never commit real credentials.

### Backend

| Variable | Required | Example / purpose |
| --- | --- | --- |
| `PORT` | Yes by current config | Backend HTTP port; `3000` for the local Vite proxy. |
| `NODE_ENV` | Recommended | Use `development` locally and `production` in deployment. Controls secure refresh-cookie settings. |
| `MONGO_URI` | Yes | MongoDB connection string for this environment. |
| `JWT_SECRET` | Yes | Strong random secret used to sign access tokens. |
| `JWT_EXPIRES_IN` | Yes by current config | Access-token lifetime, e.g. `15m`. |
| `REFRESH_TOKEN_SECRET` | Yes | Separate strong random secret required by configuration (refresh tokens are opaque and stored hashed). |
| `REFRESH_TOKEN_EXPIRES_DAYS` | Yes | Positive refresh-token lifetime in days, e.g. `7`. |
| `GROQ_API_KEY` | Yes by current config | Secret Groq API key; backend only. |
| `GROQ_CLASSIFY_MODEL` | Yes by current config | Classification model; default `llama-3.1-8b-instant`. |
| `GROQ_DRAFT_MODEL` | Yes by current config | Drafting model; default `llama-3.3-70b-versatile`. |
| `CLIENT_URL` | Yes by current config | Exact frontend origin allowed by CORS, e.g. `http://localhost:5173`. |

> The config module requires the above values at startup, including `JWT_EXPIRES_IN` and the model names, even where a fallback appears in the exported config object. Set them explicitly as shown in the example file.

### Frontend

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | API base path. Use `/api` locally with the configured Vite proxy; for separate hosting use `https://your-api-host.example/api`. This value is public in the browser bundle—never put secrets here. |

For the live Vercel deployment, configure `VITE_API_URL` to the deployed backend's `/api` URL if the API is hosted separately. Rebuild/redeploy the frontend after changing Vite environment variables.

## API documentation

Swagger UI is mounted at **`/api/docs`** and the OpenAPI JSON is at **`/api/docs.json`**. Locally:

- [Interactive API documentation](http://localhost:3000/api/docs)
- [OpenAPI JSON](http://localhost:3000/api/docs.json)

For production, replace `localhost:3000` with the backend deployment's origin. The Vercel frontend URL is not necessarily the backend URL; use the backend host configured in `VITE_API_URL`.

## Testing and quality checks

Backend tests use Jest and Supertest:

```bash
cd backend
npm test
```

Frontend production build:

```bash
cd frontend
npm run build
```

Frontend lint:

```bash
cd frontend
npm run lint
```

## Deployment notes

- Deploy the frontend and backend with their respective environment variables configured in their hosting platforms.
- Set backend `CLIENT_URL` to the deployed frontend origin so credentialed CORS requests are accepted.
- Set frontend `VITE_API_URL` to the backend's public API base URL (ending in `/api`) when frontend and backend are on separate hosts.
- Set `NODE_ENV=production` on the backend so the refresh cookie uses `Secure` and `SameSite=None`.
- Ensure the backend host supports long-lived HTTP responses for SSE and has a MongoDB network allowlist entry.
- CI runs backend tests and a frontend build. The deployment workflow deploys the frontend to Vercel on a push to `main`; Vercel credentials are GitHub Actions secrets, not application environment variables.

## Known limitations

- **Single-instance realtime:** SSE subscribers are kept in an in-memory map. Horizontal scaling requires a shared pub/sub layer such as Redis; reconnecting clients do not receive missed events.
- **Single-instance rate limiting:** Express rate-limiters use an in-memory store by default, so counters are not shared between multiple backend instances and reset on restart. Use a shared store for scaled deployments.
- **Attachment UI only:** ticket attachment names may be represented in the interface/data, but there is no end-to-end file upload or persistent object-storage integration.
- **No automated end-to-end tests:** automated coverage currently targets backend behavior; browser-level user journeys are not covered by an e2e suite.
- **Free-tier cold starts:** if the backend or database runs on a free/sleeping tier, the first request after inactivity can be slow or time out while services wake up.
- **Demo credentials are public:** seeded passwords are for demonstration only and should not be used for production accounts.
- **AI depends on an external provider:** Groq availability, quotas, rate limits, and model names can affect classification and draft generation. Manual support flows remain available when AI is unavailable.

## Repository layout

```text
backend/
  src/
    config/         Environment and MongoDB connection
    controllers/    HTTP request handlers
    docs/           OpenAPI specification
    middlewares/    Authentication, validation, errors, rate limits
    models/         Mongoose schemas
    routes/         API route definitions
    seed/           Sample data and local seed script
    services/       Domain, auth, realtime, and AI services
    validators/     Request schemas
  tests/            Jest and Supertest tests
frontend/
  src/
    app/            Router and Redux store
    components/     Shared application shells and components
    features/       Auth, books, tickets, admin, and realtime features
    services/       Shared API client
```

## License

The backend package metadata lists the ISC license. Confirm the intended license scope with the maintainers before redistributing or reusing the full application.
