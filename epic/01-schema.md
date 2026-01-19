## 01. Add database schema for hospitals, bookings, chatMessages

Task User Flow:
- 📟 Schema defines data structure for all features (instant)

## Schema Structure

### hospitals table
- id: text, primary key, nanoid or cuid
- name: text, not null
- address: text, not null
- phone: text, not null
- rating: real, not null (1-5 scale)
- openingHours: text, not null (e.g. "09:00")
- closingHours: text, not null (e.g. "18:00")
- createdAt: integer, timestamp

### bookings table
- id: text, primary key
- userId: text, not null (Clerk userId)
- hospitalId: text, not null, references hospitals.id
- preferredDate: text, not null (ISO date string)
- preferredTime: text, not null (e.g. "14:00")
- reason: text, nullable
- status: text, not null, default "pending" (pending | confirmed | cancelled)
- createdAt: integer, timestamp
- confirmedAt: integer, nullable timestamp

### chatMessages table
- id: text, primary key
- userId: text, not null (Clerk userId)
- role: text, not null (user | assistant)
- content: text, not null
- createdAt: integer, timestamp

## Checklist

- [ ] Add hospitals table to schema.ts
- [ ] Add bookings table with foreign key to hospitals
- [ ] Add chatMessages table
- [ ] Export all tables
- [ ] Run: bunx drizzle-kit push

## Files
- src/server/db/schema.ts
