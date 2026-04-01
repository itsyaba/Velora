# 🧭 AI Concierge — Intelligent Travel Assistant for Ethiopia

> Book local guides, drivers, and translators instantly with AI. Available in Amharic and English.

---

## 📖 Overview

AI Concierge is a bilingual AI-powered travel assistant built for tourists and travelers in Ethiopia. Users interact with a natural language chat interface to discover experiences, request services, and book local providers — all in seconds. Admins manage the provider marketplace through a dedicated dashboard.

Built at a hackathon in 100 hours.

---

## ✨ Features

### For Travelers
- 💬 **AI Chat** — Type or speak in Amharic or English
- 🎯 **Smart Intent Detection** — AI understands complaints, requests, and exploration queries
- 🗺️ **Personalized Suggestions** — Get matched with guides, drivers, and translators based on your needs
- ⚡ **Instant Booking** — One-click Book / Request with instant confirmation
- 🌍 **Real-time Translation** — Communicate across language barriers seamlessly

### For Admins
- 🛠️ **Provider Dashboard** — Add and manage local guides, resorts, drivers, and translators
- 📊 **Analytics** — Track top requests, bookings, and sentiment
- 🔒 **Role-based Access** — Secure admin-only routes

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Auth | Better Auth |
| Database | MongoDB + Mongoose |
| File Uploads | UploadThing |
| AI | Claude API (Anthropic) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas)
- Anthropic API key
- UploadThing account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ai-concierge.git
cd ai-concierge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Better Auth
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
/app
  /page.tsx                  → Landing page
  /chat/page.tsx             → AI Concierge chat interface
  /admin/page.tsx            → Admin dashboard
  /admin/providers/page.tsx  → Manage provider listings

/api
  /chat/route.ts             → Claude API + intent detection
  /providers/route.ts        → Provider CRUD
  /bookings/route.ts         → Booking management

/models
  /Provider.ts               → Provider schema
  /Booking.ts                → Booking schema
  /ChatLog.ts                → Chat history schema

/components
  /chat/                     → Chat UI components
  /admin/                    → Admin panel components
  /providers/                → Provider card components
```

---

## 🗂️ Database Schema

### Provider
```ts
{
  name: string
  photo: string         // UploadThing URL
  category: string      // "guide" | "driver" | "translator" | "resort"
  languages: string[]
  price: number
  availability: boolean
  description: string
}
```

### Booking
```ts
{
  userId: string
  providerId: ObjectId
  status: string        // "pending" | "confirmed" | "cancelled"
  timestamp: Date
}
```

### ChatLog
```ts
{
  sessionId: string
  messages: Message[]
  intent: string
  timestamp: Date
}
```

---

## 🤖 How the AI Works

1. User sends a message in Amharic or English
2. Claude API classifies the intent (service request / complaint / exploration)
3. Intent is matched against provider categories in MongoDB
4. Top 1–3 providers are returned with price, availability, and description
5. User clicks **Book** → booking is created and confirmation is shown

---

## 💰 Business Model

- **10% commission** on every booking made through the platform
- **Featured listings** — providers pay for priority placement
- **Premium subscription** — priority AI responses and VIP guide access

---

## 👥 Team

Built with ❤️ at [Hackathon Name] — [Your Team Name]

---

## 📄 License

MIT
