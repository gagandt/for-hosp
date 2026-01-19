import { relations, sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

// Hospitals table
export const hospitals = sqliteTable(
	"hospital",
	(d) => ({
		id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		name: d.text({ length: 255 }).notNull(),
		address: d.text({ length: 500 }).notNull(),
		phone: d.text({ length: 20 }).notNull(),
		rating: d.real().notNull().default(0),
		openingHours: d.text({ length: 10 }).notNull(), // e.g., "08:00"
		closingHours: d.text({ length: 10 }).notNull(), // e.g., "20:00"
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
	}),
	(t) => [index("hospital_name_idx").on(t.name)],
);

export const hospitalsRelations = relations(hospitals, ({ many }) => ({
	bookings: many(bookings),
}));

// Booking status enum values
export const bookingStatusValues = ["pending", "confirmed", "cancelled"] as const;
export type BookingStatus = (typeof bookingStatusValues)[number];

// Bookings table
export const bookings = sqliteTable(
	"booking",
	(d) => ({
		id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		userId: d.text({ length: 255 }).notNull(), // Clerk user ID
		hospitalId: d
			.integer({ mode: "number" })
			.notNull()
			.references(() => hospitals.id),
		preferredDate: d.text({ length: 10 }).notNull(), // e.g., "2024-01-15"
		preferredTime: d.text({ length: 10 }).notNull(), // e.g., "10:00"
		reason: d.text({ length: 1000 }).notNull(),
		status: d
			.text({ length: 20 })
			.$type<BookingStatus>()
			.notNull()
			.default("pending"),
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
		confirmedAt: d.integer({ mode: "timestamp" }),
	}),
	(t) => [
		index("booking_user_id_idx").on(t.userId),
		index("booking_hospital_id_idx").on(t.hospitalId),
		index("booking_status_idx").on(t.status),
	],
);

export const bookingsRelations = relations(bookings, ({ one }) => ({
	hospital: one(hospitals, {
		fields: [bookings.hospitalId],
		references: [hospitals.id],
	}),
}));

// Chat message role enum values
export const chatRoleValues = ["user", "assistant"] as const;
export type ChatRole = (typeof chatRoleValues)[number];

// Chat messages table
export const chatMessages = sqliteTable(
	"chat_message",
	(d) => ({
		id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		userId: d.text({ length: 255 }).notNull(), // Clerk user ID
		role: d.text({ length: 20 }).$type<ChatRole>().notNull(),
		content: d.text().notNull(),
		createdAt: d
			.integer({ mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
	}),
	(t) => [
		index("chat_message_user_id_idx").on(t.userId),
		index("chat_message_created_at_idx").on(t.createdAt),
	],
);
