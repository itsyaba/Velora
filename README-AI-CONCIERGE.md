# AI Concierge - Travel Assistant App

A complete AI-powered travel assistant application built with Next.js 14, Tailwind CSS, shadcn/ui, and Framer Motion.

## Features

### 🏠 Landing Page
- Claude.ai-style centered layout
- Interactive chat input with Amharic placeholder text
- Suggested prompt chips for quick interactions
- Responsive design with dark mode support
- Authentication modal integration

### 💬 Chat Interface
- Full-featured chat UI with message threading
- Sidebar showing past conversations
- AI typing indicator with animated dots
- Provider suggestion cards embedded in chat messages
- Auto-resizing chat input with send functionality

### 🔐 Authentication
- Modal-based authentication with tabs
- Sign in and Register forms
- Simulated authentication state
- Auto-send pending messages after login

### 📊 Admin Panel
- Protected admin interface
- Dashboard with metrics cards
- Provider management with CRUD operations
- Booking management system
- Availability toggles for providers

## Tech Stack

- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Context
- **Notifications**: Sonner (Toast)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Navigation

- **Landing Page**: `/`
- **Chat Interface**: `/chat` (requires sign in)
- **Admin Dashboard**: `/admin`
- **Admin Providers**: `/admin/providers`
- **Admin Bookings**: `/admin/bookings`

## Key Features Demonstrated

### Mock Data System
- Pre-configured providers with categories, languages, pricing
- Mock AI responses with trigger-based matching
- Past conversation history for sidebar

### Interactive Elements
- Click prompt chips to populate chat input
- Send messages triggers authentication flow
- Provider cards with booking functionality
- Admin availability toggles

### Animations
- Modal open/close animations
- Message appearance animations
- Provider cards sliding in
- Typing indicator dots animation

### Responsive Design
- Mobile-friendly layout
- Adaptive sidebar for chat
- Responsive admin panel
- Touch-friendly interactions

## File Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/
│   │   └── page.tsx         # Chat interface
│   ├── admin/
│   │   ├── layout.tsx       # Admin layout
│   │   ├── page.tsx         # Dashboard
│   │   ├── providers/
│   │   │   └── page.tsx     # Provider management
│   │   └── bookings/
│   │       └── page.tsx     # Booking management
│   └── layout.tsx           # Root layout
├── components/
│   ├── chat/                # Chat components
│   ├── auth/                # Authentication components
│   ├── admin/               # Admin components
│   └── ui/                  # shadcn/ui components
├── context/
│   └── AppContext.tsx       # Global state management
└── data/
    └── mockData.ts          # Mock data and responses
```

## Usage Flow

1. **Landing Page**: Users see the AI Concierge interface
2. **Authentication**: Clicking send triggers sign in modal
3. **Chat Interface**: After login, users can chat with AI
4. **Provider Suggestions**: AI responses include provider cards
5. **Booking**: Clicking "Book" shows success toast
6. **Admin Panel**: Manage providers and view bookings

## Mock Data

The app includes comprehensive mock data:
- 4 sample providers (Tour Guide, Translator, Driver, Resort Guide)
- Trigger-based AI responses
- Past conversation history
- Sample bookings and metrics

## Notes

- This is a UI-only demonstration with no real backend
- All data is mocked and simulated
- Authentication is simulated (no real user system)
- Images use placeholder paths
- Form submissions are simulated with toast notifications
