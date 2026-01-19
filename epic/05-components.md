## 05. Build UI components for all features

Task User Flow:
- 👤 User interacts with components
- 💻 Components handle UI logic and tRPC calls (instant)

## Component Specifications

### Navbar.tsx
Location: src/app/_components/Navbar.tsx

Elements:
- Logo/App name on left: "AI Doctor"
- Nav links: Home, Chatbot, Near Hospitals, My Bookings
- User button on right: Clerk UserButton component for logout
- Active link highlighting based on current route
- Responsive: hamburger menu on mobile (optional, time permitting)

Links:
- Home → /home
- Chatbot → /chatbot
- Near Hospitals → /hospitals
- My Bookings → /bookings

### ChatWindow.tsx
Location: src/app/_components/ChatWindow.tsx

Uses: useChat hook from "ai/react"

Elements:
- Message list container (scrollable)
- Each message: role indicator (You/AI), content, timestamp
- Input field at bottom
- Send button
- Loading indicator when AI is responding

Behavior:
- On mount, fetch chat history from tRPC chat.getHistory
- Initialize useChat with api: "/api/chat", initialMessages from history
- On each message send/receive, call tRPC chat.saveMessage to persist
- Auto-scroll to bottom on new messages

### HospitalCard.tsx
Location: src/app/_components/HospitalCard.tsx

Props: hospital object

Elements:
- Hospital name (large text)
- Rating: display as "⭐ 4.5" or star icons
- Phone number with tel: link
- Address
- Hours: "Open: 09:00 - 18:00"
- "Book Appointment" button

Styling:
- Card with border, rounded corners, padding
- Hover effect (subtle shadow)

### BookingModal.tsx
Location: src/app/_components/BookingModal.tsx

Props: isOpen, onClose, hospital, onSuccess

Elements:
- Modal overlay (click outside to close)
- Modal content with form
- Title: "Book Appointment at {hospital.name}"
- Form fields:
  - Preferred Date: date input, required
  - Preferred Time: time input or select with common slots, required
  - Reason for Visit: textarea, optional
- Cancel button (closes modal)
- Submit button

Behavior:
- On submit, call tRPC booking.create with form data
- Show loading state on submit button
- On success, call onSuccess prop, close modal
- On error, show error message

### BookingCard.tsx
Location: src/app/_components/BookingCard.tsx

Props: booking object (with hospital info joined)

Elements:
- Hospital name
- Preferred date and time
- Reason (if provided)
- Status badge:
  - Pending: yellow/orange badge
  - Confirmed: green badge
  - Cancelled: red/gray badge
- Cancel button (only show if status = "pending")

Behavior:
- Cancel button calls tRPC booking.cancel
- Confirm dialog before cancelling: "Are you sure?"
- Refetch bookings after cancel

### AdminBookingCard.tsx
Location: src/app/_components/AdminBookingCard.tsx

Props: booking object (with hospital and user info)

Elements:
- Everything from BookingCard
- Plus: User ID or email (if available from Clerk)
- Booking created date
- Confirm button (only show if status = "pending")
- Status dropdown or buttons: Confirm / Cancel

Behavior:
- Confirm button calls tRPC booking.updateStatus with status "confirmed"
- Cancel button calls tRPC booking.updateStatus with status "cancelled"
- Refetch after status change

## Seed Data

Either create seed script or hardcode in hospital router getAll.

Sample hospitals:
1. City General Hospital - 4.5 rating - "123 Main St" - "555-0100" - 08:00-20:00
2. Metro Health Center - 4.2 rating - "456 Oak Ave" - "555-0200" - 09:00-18:00
3. Sunrise Medical Clinic - 4.8 rating - "789 Pine Rd" - "555-0300" - 07:00-19:00
4. Valley Care Hospital - 4.0 rating - "321 Elm St" - "555-0400" - 24 hours (00:00-23:59)
5. Community Health Hub - 4.3 rating - "654 Maple Dr" - "555-0500" - 08:00-17:00

## Checklist

- [ ] Create src/app/_components/Navbar.tsx
- [ ] Create src/app/_components/ChatWindow.tsx with useChat integration
- [ ] Create src/app/_components/HospitalCard.tsx
- [ ] Create src/app/_components/BookingModal.tsx with form
- [ ] Create src/app/_components/BookingCard.tsx with cancel
- [ ] Create src/app/_components/AdminBookingCard.tsx with status update
- [ ] Add seed data (either in router or seed script)

## Files
- src/app/_components/Navbar.tsx
- src/app/_components/ChatWindow.tsx
- src/app/_components/HospitalCard.tsx
- src/app/_components/BookingModal.tsx
- src/app/_components/BookingCard.tsx
- src/app/_components/AdminBookingCard.tsx
- src/server/db/seed.ts (optional)
