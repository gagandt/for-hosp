import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { chatMessages, chatRoleValues } from "~/server/db/schema";

export const chatRouter = createTRPCRouter({
	// Get chat history for the current user
	getHistory: protectedProcedure.query(async ({ ctx }) => {
		const messages = await ctx.db.query.chatMessages.findMany({
			where: eq(chatMessages.userId, ctx.userId),
			orderBy: (chatMessages, { asc }) => [asc(chatMessages.createdAt)],
		});

		return messages;
	}),

	// Save a message to the chat history
	saveMessage: protectedProcedure
		.input(
			z.object({
				role: z.enum(chatRoleValues),
				content: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db
				.insert(chatMessages)
				.values({
					userId: ctx.userId,
					role: input.role,
					content: input.content,
				})
				.returning();

			return result[0];
		}),

	// Clear chat history for the current user
	clearHistory: protectedProcedure.mutation(async ({ ctx }) => {
		await ctx.db
			.delete(chatMessages)
			.where(eq(chatMessages.userId, ctx.userId));

		return { success: true };
	}),
});
