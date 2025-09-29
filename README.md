<div align="center">

<img src="./public/images/danameme-logo.png" alt="DANAMEME Logo" width="420" />

</div>

# DANAMEME

DANAMEME — a lightweight meme sharing platform for campus communities with login, posts, comments, and voting.

## TL;DR

- Problem: Teams share memes across chats; nothing persistent, safe, or searchable.
- Outcome: Simple web app with auth, email verification, posts, comments, and votes; image storage via Azure Blob.
- Stack: Next.js 14 (App Router), React 18, Tailwind; MongoDB + Mongoose; JWT; Azure Blob; Imgix; Mailgun.
- Scope: 10+ API endpoints; account management; image upload; password reset/migration.
- Result: Runnable locally, deployable to Vercel; Terraform for Azure storage.
- My role: Full-stack dev.

## Why This Project Exists

Motivation: Built for Swiss Post ICT Campus to give students/apprentices a shared, moderated place to post memes without relying on ephemeral chat threads. A small, secure stack keeps costs and ops low (free) while enabling a friendly community. The code serves as a practical demo of a modern full‑stack Next.js app with cloud storage and email flows.

## Key Features

- Authentication: Email check, login, JWT-based session cookie, middleware gating of routes.
- Email Verification: OTP code generation and verification (Mailgun optional in dev).
- Account Management: Update email/name (re-verifies on email change), username change with validation, profile image upload to Azure Blob.
- Posts: Create/read/update/delete posts with optional image upload; voting with karma impact.
- Comments: Add comments and vote on comments.
- Infrastructure: Terraform to provision Azure Storage Accounts and containers.

## Architecture at a Glance

- App Router: Next.js pages + route handlers under `app/api/*` serve both UI and API.
- Persistence: MongoDB via Mongoose; unique constraints on `email`/`username`.
- Auth: JWT signed with `JWT_SECRET`; `session` cookie for UI, `Authorization: Bearer` for API.
- Media: Images uploaded to Azure Blob; delivery via `IMAGE_URL` which can point to an Imgix CDN domain (origin = Azure) for fast, transformed image responses.
- Email: Mailgun client optional; if unset, emails are skipped but flows remain testable.

```
[User Browser]
   |                 \
   v                  \-- fetch image URLs --> [Imgix CDN]
[Next.js App (UI)]                          ^           \
   |                                        | (origin)   v
   v                                        |        [Azure Blob]
[Next.js API Route Handlers]                |
   |        \-------------------------------/  (uploads by API)
   v
[MongoDB] (Mongoose)
```

Mini ADR (implicit):
- Context: Need a small, deployable full‑stack footprint with SSR + API.
- Decision: Use Next.js App Router + route handlers instead of a separate backend.
- Consequences: Simpler deploy and data flow; API auth constraints handled via middleware and headers.

## Tech Stack

- Next.js 14: UI + API routes, middleware, image optimization.
- React 18 + Tailwind CSS: Frontend components and styles.
- MongoDB + Mongoose: Persistence and schema modeling.
- JWT (jose/jsonwebtoken): Sign/verify sessions.
- Azure Blob Storage: Store post and profile images.
- Imgix CDN: Fast global delivery and on-the-fly image transformations; origin is Azure Blob.
- Mailgun: Send OTP and password reset/migration emails (optional locally).
- Terraform + azurerm: Provision storage accounts/containers.

## Quickstart (Developers)

Prerequisites:
- Node 20.x, npm
- MongoDB (local or Atlas)
- Optional: Azure Storage (for image upload) and Mailgun (for emails)

Local run:
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values (see table below)
npm run dev
# App: http://localhost:3000
```

## Configuration & Environment Variables

| NAME | Required | Default | Description |
|---|:---:|---|---|
| `MONGODB_URI` | Yes | — | MongoDB connection string used by Mongoose. |
| `JWT_SECRET` | Yes | — | Secret for signing JWT access tokens. |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:3000/api` (dev via `next.config.mjs`) | Public base URL for client fetches to API. |
| `AZURE_CONNECTION_STRING` | Only for uploads | — | Azure Storage connection string used by BlobServiceClient. |
| `IMAGE_URL` | Only for image rendering | — | Public image host. Use your Imgix domain (e.g., `your-subdomain.imgix.net`) for CDN/transformations, or your Azure Blob host (e.g., `<acct>.blob.core.windows.net`). Next.js allows this host via `next.config.mjs`. |
| `MAILGUN_API_KEY` | No | — | Mailgun API key. If missing, email sending is skipped. |
| `MAILGUN_DOMAIN` | No | — | Mailgun domain. If missing, email sending is skipped. |

## API Overview

- Auth token: `POST /api/auth/login` returns header `accessToken: Bearer <jwt>`.
- Auth usage: Send `Authorization: Bearer <jwt>` to all protected endpoints.
- Registration flow: `POST /api/accounts` creates user and triggers `POST /api/accounts/email-verification` (OTP via Mailgun if configured). `PATCH /api/accounts/email-verification` verifies OTP and returns a refreshed `accessToken` header.
- Password reset: `POST /api/accounts/password-reset` issues a time-limited token (migration supported). `GET` validates token; `PATCH` updates password (either with JWT or with reset token).
- Posts: `GET /api/posts` lists posts with comments; `POST /api/posts` creates; `PATCH/DELETE /api/posts/id/:id` updates/deletes; `POST /api/posts/id/:id/vote` handles up/down votes.
- Comments: `POST /api/posts/id/:id/comment` creates; `POST /api/posts/id/:id/comment/id/:commentId/vote` votes.
- Profiles: `PATCH /api/accounts/id/:id/profile` updates username; `PATCH /api/accounts/id/:id/account` updates email/name (email change re-triggers verification); `PATCH /api/accounts/id/:id/profile-image` uploads to Azure (expects data URL; requires Azure envs). Delivery can be via Imgix if `IMAGE_URL` points to your Imgix domain.
- Availability checks: `GET /api/accounts/username?username=...` and `GET /api/accounts/email?email=...` for client-side validation.

See `app/api/*` for full request/response payloads and validation rules.

## Data Model

```
Entities and relationships (ASCII):

Account (1) ----< Post (many)
Account (1) ----< Comment (many)
Post    (1) ----< Comment (many)

Account
  - _id:ObjectId (PK)
  - email:string (UNIQUE)
  - username:string (UNIQUE)
  - firstname:string, lastname:string
  - password:string|null
  - karma:number, emailVerified:boolean, banned:boolean
  - profileImage:string|null

Post
  - _id:ObjectId (PK)
  - createdAt:date, title:string, image:string|null
  - account:ObjectId (FK -> Account)
  - upvotes:ObjectId[] (Account ids)
  - downvotes:ObjectId[] (Account ids)

Comment
  - _id:ObjectId (PK)
  - createdAt:date, content:string
  - post:ObjectId (FK -> Post)
  - account:ObjectId (FK -> Account)
  - upvotes:ObjectId[] (Account ids)
  - downvotes:ObjectId[] (Account ids)

EmailVerification
  - code:number, validUntil:date, email:string

PasswordReset
  - guid:string, validUntil:date, email:string, isMigrating:boolean
```

## Testing & Quality

- Lint: `npm run lint` (Next.js ESLint config).
- Type checking: Not used (JS project).
- Unit tests: Not included yet.
- Build: `npm run build`; Start: `npm start`.

## Limitations & Trade-offs

- No rate limiting or abuse prevention on API endpoints.
- No pagination/infinite scroll wired in API; `GET /posts` returns all posts.
- Email and image features depend on external services; local dev can run without them but features degrade.
- Minimal logging/metrics; no tracing or dashboards.

## Roadmap

- Add tests (unit/integration) for critical routes and validation.
- Add rate limiting, pagination, and soft deletes.
- Improve observability (structured logs, basic metrics).
- Dockerize for one‑command local spin‑up with Mongo and Azurite.
- Harden auth (refresh rotation, CSRF review) and add admin moderation tools.

## License (Source-Available)

This code is provided under a Source‑Available model for portfolio review and learning.

- Allowed: Read/browse the repository, run locally for evaluation, adapt privately.
- Not allowed: Redistribution, commercial use, or production deployment without explicit permission.

No separate license file is included; contact the author for other uses.
