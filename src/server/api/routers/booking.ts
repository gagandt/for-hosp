import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
	bookings,
	bookingStatusValues,
	type BookingStatus,
} from "~/server/db/schema";
import { env } from "~/env";

// Helper to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
	const client = await clerkClient();
	const user = await client.users.getUser(userId);
	const userEmail = user.emailAddresses[0]?.emailAddress;
	return userEmail === env.ADMIN_EMAIL;
}

export const bookingRouter = createTRPCRouter({
	// Create a new booking
	create: protectedProcedure
		.input(
			z.object({
				hospitalId: z.number(),
				preferredDate: z.string().min(1),
				preferredTime: z.string().min(1),
				reason: z.string().min(1).max(1000),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db
				.insert(bookings)
				.values({
					userId: ctx.userId,
					hospitalId: input.hospitalId,
					preferredDate: input.preferredDate,
					preferredTime: input.preferredTime,
					reason: input.reason,
					status: "pending",
				})
				.returning();

			return result[0];
		}),

	// Get current user's bookings
	getMyBookings: protectedProcedure.query(async ({ ctx }) => {
		const userBookings = await ctx.db.query.bookings.findMany({
			where: eq(bookings.userId, ctx.userId),
			with: {
				hospital: true,
			},
			orderBy: (bookings, { desc }) => [desc(bookings.createdAt)],
		});

		return userBookings;
	}),

	// Cancel a booking (user can only cancel their own)
	cancel: protectedProcedure
		.input(z.object({ bookingId: z.number() }))
		.mutation(async ({ ctx, input }) => {
			// First check if the booking belongs to the user
			const booking = await ctx.db.query.bookings.findFirst({
				where: eq(bookings.id, input.bookingId),
			});

			if (!booking) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Booking not found",
				});
			}

			if (booking.userId !== ctx.userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You can only cancel your own bookings",
				});
			}

			if (booking.status === "cancelled") {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Booking is already cancelled",
				});
			}

			const result = await ctx.db
				.update(bookings)
				.set({ status: "cancelled" })
				.where(eq(bookings.id, input.bookingId))
				.returning();

			return result[0];
		}),

	// Get all bookings (admin only)
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const adminCheck = await isAdmin(ctx.userId);

		if (!adminCheck) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Admin access required",
			});
		}

		const allBookings = await ctx.db.query.bookings.findMany({
			with: {
				hospital: true,
			},
			orderBy: (bookings, { desc }) => [desc(bookings.createdAt)],
		});

		// Get user info for each booking
		const client = await clerkClient();
		const bookingsWithUsers = await Promise.all(
			allBookings.map(async (booking) => {
				try {
					const user = await client.users.getUser(booking.userId);
					return {
						...booking,
						userEmail: user.emailAddresses[0]?.emailAddress ?? "Unknown",
						userName: user.fullName ?? user.firstName ?? "Unknown",
					};
				} catch {
					return {
						...booking,
						userEmail: "Unknown",
						userName: "Unknown",
					};
				}
			}),
		);

		return bookingsWithUsers;
	}),

	// Update booking status (admin only)
	updateStatus: protectedProcedure
		.input(
			z.object({
				bookingId: z.number(),
				status: z.enum(bookingStatusValues),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const adminCheck = await isAdmin(ctx.userId);

			if (!adminCheck) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Admin access required",
				});
			}

			const updateData: {
				status: BookingStatus;
				confirmedAt?: Date;
			} = {
				status: input.status,
			};

			// Set confirmedAt when status is confirmed
			if (input.status === "confirmed") {
				updateData.confirmedAt = new Date();
			}

			const result = await ctx.db
				.update(bookings)
				.set(updateData)
				.where(eq(bookings.id, input.bookingId))
				.returning();

			return result[0];
		}),
});
