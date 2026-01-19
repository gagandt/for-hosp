## 02. Create tRPC routers for hospital, booking, chat

Task User Flow:
- 📟 Routers handle all API logic for features (instant)

## Router Specifications

### hospital.ts router
Procedures:
- getAll: publicProcedure, returns all hospitals from DB

### booking.ts router
Procedures:
- create: protectedProcedure
  - input: hospitalId, preferredDate, preferredTime, reason (optional)
  - inserts booking with status "pending", userId from ctx.auth
- getMyBookings: protectedProcedure
  - returns bookings where userId = ctx.auth.userId, ordered by createdAt desc
- cancel: protectedProcedure
  - input: bookingId
  - updates status to "cancelled" where id = bookingId AND userId = ctx.auth.userId
- getAll: protectedProcedure (admin only)
  - check if ctx.auth.userId email matches admin email, throw if not
  - returns all bookings with hospital info joined
- updateStatus: protectedProcedure (admin only)
  - input: bookingId, status
  - admin check same as above
  - updates booking status, sets confirmedAt if status = "confirmed"

### chat.ts router
Procedures:
- getHistory: protectedProcedure
  - returns chatMessages where userId = ctx.auth.userId, ordered by createdAt asc
- saveMessage: protectedProcedure
  - input: role, content
  - inserts message with userId from ctx.auth

### Admin Check Helper
- ADMIN_EMAIL constant at top of booking.ts (hardcode your email)
- Helper function: isAdmin(userId) - fetch user from Clerk, check email match
- Or simpler: store admin userIds directly if known

## Checklist

- [ ] Create src/server/api/routers/hospital.ts with getAll
- [ ] Create src/server/api/routers/booking.ts with all procedures
- [ ] Create src/server/api/routers/chat.ts with getHistory, saveMessage
- [ ] Add admin email constant and check helper in booking.ts
- [ ] Register all routers in src/server/api/root.ts

## Files
- src/server/api/routers/hospital.ts
- src/server/api/routers/booking.ts
- src/server/api/routers/chat.ts
- src/server/api/root.ts
