# Velora — AI Concierge for Ethiopia

Book local guides, drivers, and translators with a bilingual (Amharic + English) AI concierge. This repo implements the **Traveler MVP**: text chat, intent classification, top provider suggestions from MongoDB, and one-click **Book / Request** with pending bookings.

---

## Features (implemented)

- **AI Concierge** at `/concierge` (signed-in users) — streaming replies via **Gemini** (Vercel AI SDK + `@ai-sdk/google`)
- **Intent detection** — service requests, complaints, exploration, on-demand; optional clarifying questions
- **Provider cards** — top 1–3 matches with price, languages, description
- **Bookings** — `POST /api/bookings` creates a `pending` record (manual confirmation is fine for early stage)

Voice, real-time translation relay, payments, and analytics dashboards are not in this MVP.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | Tailwind CSS + shadcn/ui |
| Auth | Better Auth |
| Database | MongoDB + Mongoose |
| AI | Gemini API via `ai` + `@ai-sdk/google` |

---

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- [Google AI Studio](https://aistudio.google.com/) API key (`GOOGLE_GENERATIVE_AI_API_KEY`)

### Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local: DATABASE_URL, BETTER_AUTH_SECRET, GOOGLE_GENERATIVE_AI_API_KEY
npm run seed   # optional: seed mock providers
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in, then open **Concierge** from the header or go to `/concierge`.

---

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | MongoDB connection string |
| `BETTER_AUTH_SECRET` | Yes | Session encryption |
| `BETTER_AUTH_URL` | Yes | App URL (e.g. `http://localhost:3000`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes for chat | Gemini API key |
| `GEMINI_MODEL` | No | Model id (default `gemini-2.0-flash`) |

OAuth env vars are optional; configure in Better Auth if you use GitHub/Google/Twitter sign-in.

---

## Project structure (relevant paths)

```
app/
  concierge/page.tsx       → Concierge UI
  api/chat/route.ts        → Gemini streaming + intent + suggestions
  api/bookings/route.ts    → Create pending booking
lib/
  models/                  → Provider, Booking, ChatSession (Mongoose)
  provider-query.ts        → Top providers by category
  concierge-classifier.ts  → Zod schema + system prompt helpers
components/
  concierge-chat.tsx       → Chat + suggestion cards + Book/Request
scripts/
  seed-providers.ts        → Seed mock providers (`npm run seed`)
```

---

## How the AI flow works

1. Client sends messages to `POST /api/chat` with `sessionId` (chat id).
2. Server runs **structured classification** (`generateObject`) for intent and category.
3. Server loads up to **3 providers** from MongoDB when appropriate (not for pure complaints or when clarification is needed).
4. Server streams the assistant reply and sends a **`data-suggestions`** chunk for the UI cards.
5. **Book** / **Request** calls `POST /api/bookings` with `providerId`.

---

## License

MIT
