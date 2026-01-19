## Context

Building AI doctor consultation app on existing T3 stack with Clerk auth, Turso DB, tRPC.

Start with these files:
- src/server/db/schema.ts (existing schema pattern)
- src/server/api/routers/post.ts (tRPC router pattern)
- src/server/api/root.ts (router registration)
- src/middleware.ts (Clerk middleware)
- src/app/layout.tsx (root layout with providers)

# AI Doctor Consultation Web App

## User Story

As a patient, I want to consult an AI health assistant and book appointments at nearby hospitals so I can get health guidance and schedule doctor visits without calling multiple hospitals.

## Epic User Flow

Flow 1: Authentication + Home
1. 👤 User visits landing page
2. 💻 Shows "Please login to continue" with Clerk sign-in button (instant)
3. 👤 User clicks sign-in, completes Clerk auth
4. 💻 Redirects to dashboard with feature descriptions and navbar (instant)

Flow 2: AI Chatbot
5. 👤 User clicks "Chatbot" in navbar
6. 💻 Chat page loads with previous messages from DB (1-2 seconds)
7. 👤 User types health question, clicks send
8. 📟 AI processes message, streams response (3-10 seconds)
9. 💻 Response displays with typing effect, saved to DB (instant)

Flow 3: Hospital Booking
10. 👤 User clicks "Near Hospitals" in navbar
11. 💻 Hospital list page loads with cards showing all details (instant)
12. 👤 User clicks "Book Appointment" on hospital card
13. 💻 Booking modal opens with form (date, time, reason) (instant)
14. 👤 User fills form, clicks submit
15. 📟 Booking saved to DB with status "pending" (1-2 seconds)
16. 💻 Success message, redirects to My Bookings (instant)

Flow 4: My Bookings
17. 👤 User clicks "My Bookings" in navbar
18. 💻 Shows booking list with status badges (pending/confirmed/cancelled) (instant)
19. 👤 User clicks "Cancel" on pending booking
20. 📟 Status updated to "cancelled" in DB (1 second)

Flow 5: Admin Panel
21. 👤 Admin user navigates to /admin
22. 💻 Shows all bookings from all users (instant)
23. 👤 Admin clicks "Confirm" on a booking
24. 📟 Status updated to "confirmed" in DB (1 second)
25. 💻 Patient sees updated status in My Bookings (instant)

Success: User can chat with AI, browse hospitals, book appointments, track booking status - all within 2 minutes

## Technical Overview

Database Layer: Turso/SQLite with Drizzle - hospitals, bookings, chatMessages tables
Service Layer: tRPC routers - hospital, booking, chat routers + Vercel AI SDK for chatbot
Frontend Layer: Next.js App Router pages - dashboard, chatbot, hospitals, bookings, admin

## Sequential Tasks

01. Add database schema for hospitals, bookings, chatMessages

Task User Flow:
- 📟 Schema defines data structure for all features (instant)

- [ ] Add hospitals table: id, name, address, phone, rating, openingHours, closingHours
- [ ] Add bookings table: id vishal odvi ssionId, hospitalId, preferredDate, preferredTime, reason, status, createdAt, confirmedAt
- [ ] Add chatMessages table: id vishal odvi ssionId, role (user/assistant), content, createdAt
- [ ] Add status enum: pending, confirmed, cancelled
- [ ] Run drizzle-kit push to sync with Turso
- Files: src/server/db/schema.ts
- Start: existing post table pattern in schema.ts

02. Create tRPC routers for hospital, booking, chat

Task User Flow:
- 📟 Routers handle all API logic for features (instant)

- [ ] Create hospital router: getAll procedure (public)
- [ ] Create booking router: create, getMyBookings, cancel, getAll (admin), updateStatus (admin)
- [ ] Create chat router: getHistory, saveMessage
- [ ] Add admin check helper using Clerk userId against hardcoded admin email
- [ ] Register routers in root.ts
- Files: 
  - src/server/api/routers/hospital.ts
  - src/server/api/routers/booking.ts
  - src/server/api/routers/chat.ts
  - src/server/api/root.ts
- Start: src/server/api/routers/post.ts pattern

03. Create AI chat API route with Vercel AI SDK

Task User Flow:
- 👤 User sends message
- 📟 AI processes and streams response (3-10 seconds)

- [ ] Create chat API route using Vercel AI SDK
- [ ] Configure OpenAI gpt-4.1 model
- [ ] Add system prompt: friendly health assistant, asks follow-ups, always recommends consulting real doctor
- [ ] Stream response back to client
- Files: src/app/api/chat/route.ts

04. Build frontend pages and components

Task User Flow:
- 👤 User navigates app
- 💻 Pages render with data from tRPC (instant)

- [ ] Update middleware.ts to protect routes, allow /sign-in, /sign-up, / public
- [ ] Create landing page at src/app/page.tsx - "Please login to continue" + Clerk button
- [ ] Create dashboard layout at src/app/(dashboard)/layout.tsx with navbar
- [ ] Create dashboard home at src/app/(dashboard)/home/page.tsx with feature descriptions
- [ ] Create chatbot page at src/app/(dashboard)/chatbot/page.tsx
- [ ] Create hospitals page at src/app/(dashboard)/hospitals/page.tsx
- [ ] Create bookings page at src/app/(dashboard)/bookings/page.tsx
- [ ] Create admin page at src/app/(dashboard)/admin/page.tsx with email check guard
- Files:
  - src/middleware.ts
  - src/app/page.tsx
  - src/app/(dashboard)/layout.tsx
  - src/app/(dashboard)/home/page.tsx
  - src/app/(dashboard)/chatbot/page.tsx
  - src/app/(dashboard)/hospitals/page.tsx
  - src/app/(dashboard)/bookings/page.tsx
  - src/app/(dashboard)/admin/page.tsx

05. Build UI components for all features

Task User Flow:
- 👤 User interacts with components
- 💻 Components handle UI logic and tRPC calls (instant)

- [ ] Create Navbar component with links: Home, Chatbot, Near Hospitals, My Bookings, Logout
- [ ] Create ChatWindow component: message list, input, send button, useChat hook from AI SDK
- [ ] Create HospitalCard component: name, rating (stars), phone, address, hours, Book button
- [ ] Create BookingModal component: form with date, time, reason fields, submit handler
- [ ] Create BookingCard component: hospital name, date, time, status badge, cancel button
- [ ] Create AdminBookingCard component: same as BookingCard + user info + confirm button
- [ ] Seed hospitals data: 5-6 hardcoded hospitals in seed script or direct insert
- Files:
  - src/app/_components/Navbar.tsx
  - src/app/_components/ChatWindow.tsx
  - src/app/_components/HospitalCard.tsx
  - src/app/_components/BookingModal.tsx
  - src/app/_components/BookingCard.tsx
  - src/app/_components/AdminBookingCard.tsx
  - src/server/db/seed.ts (optional, can hardcode in hospital router)
