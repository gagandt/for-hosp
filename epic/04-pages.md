## 04. Build frontend pages and components

Task User Flow:
- 👤 User navigates app
- 💻 Pages render with data from tRPC (instant)

## Page Structure

### Route Structure
```
src/app/
├── page.tsx                          # Landing (public)
├── api/chat/route.ts                 # AI chat API
├── (dashboard)/
│   ├── layout.tsx                    # Dashboard layout with Navbar
│   ├── home/page.tsx                 # Feature descriptions
│   ├── chatbot/page.tsx              # AI chat interface
│   ├── hospitals/page.tsx            # Hospital list
│   ├── bookings/page.tsx             # My bookings
│   └── admin/page.tsx                # Admin panel
├── sign-in/[[...sign-in]]/page.tsx   # Clerk (exists)
└── sign-up/[[...sign-up]]/page.tsx   # Clerk (exists)
```

### Page Specifications

#### src/app/page.tsx (Landing)
- Hero section with app title "AI Doctor Consultation"
- Brief description of features
- "Please login to continue" message
- Clerk SignInButton or link to /sign-in
- No navbar, centered content

#### src/app/(dashboard)/layout.tsx
- Import and render Navbar component
- Children rendered below navbar
- Wrap with any needed providers

#### src/app/(dashboard)/home/page.tsx
- Welcome message with user's name from Clerk
- 3-4 feature cards describing:
  - AI Chatbot: "Get instant health guidance from our AI assistant"
  - Near Hospitals: "Browse nearby hospitals and their details"
  - Easy Booking: "Request appointments with one click"
  - Track Bookings: "View and manage all your appointments"
- Quick action buttons linking to each feature

#### src/app/(dashboard)/chatbot/page.tsx
- Render ChatWindow component
- Page title "AI Health Assistant"
- Disclaimer text at top: "This AI provides general guidance only. Always consult a healthcare professional."

#### src/app/(dashboard)/hospitals/page.tsx
- Page title "Nearby Hospitals"
- Grid of HospitalCard components
- Fetch hospitals using tRPC hospital.getAll
- BookingModal component (hidden by default, shown on Book click)

#### src/app/(dashboard)/bookings/page.tsx
- Page title "My Bookings"
- List of BookingCard components
- Fetch using tRPC booking.getMyBookings
- Empty state if no bookings: "No bookings yet. Browse hospitals to book an appointment."

#### src/app/(dashboard)/admin/page.tsx
- Admin check: if user email !== ADMIN_EMAIL, show "Access Denied"
- Page title "Admin - All Bookings"
- List of AdminBookingCard components
- Fetch using tRPC booking.getAll
- Filter tabs: All, Pending, Confirmed, Cancelled (optional, time permitting)

### Middleware Update (src/middleware.ts)
- Public routes: /, /sign-in, /sign-up, /api/trpc
- Protected: everything else (Clerk handles redirect)

## Checklist

- [ ] Update src/middleware.ts with correct public/protected routes
- [ ] Create src/app/page.tsx landing page
- [ ] Create src/app/(dashboard)/layout.tsx with Navbar
- [ ] Create src/app/(dashboard)/home/page.tsx
- [ ] Create src/app/(dashboard)/chatbot/page.tsx
- [ ] Create src/app/(dashboard)/hospitals/page.tsx
- [ ] Create src/app/(dashboard)/bookings/page.tsx
- [ ] Create src/app/(dashboard)/admin/page.tsx with admin check

## Files
- src/middleware.ts
- src/app/page.tsx
- src/app/(dashboard)/layout.tsx
- src/app/(dashboard)/home/page.tsx
- src/app/(dashboard)/chatbot/page.tsx
- src/app/(dashboard)/hospitals/page.tsx
- src/app/(dashboard)/bookings/page.tsx
- src/app/(dashboard)/admin/page.tsx
