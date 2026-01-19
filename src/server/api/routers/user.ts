import { clerkClient } from "@clerk/nextjs/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
	/**
	 * Get the current authenticated user's profile information
	 */
	getMe: protectedProcedure.query(async ({ ctx }) => {
		const client = await clerkClient();
		const user = await client.users.getUser(ctx.userId);

		return {
			id: user.id,
			email: user.emailAddresses[0]?.emailAddress ?? null,
			firstName: user.firstName,
			lastName: user.lastName,
			fullName: user.fullName,
			imageUrl: user.imageUrl,
			username: user.username,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			lastSignInAt: user.lastSignInAt,
			emailVerified:
				user.emailAddresses[0]?.verification?.status === "verified",
			externalAccounts: user.externalAccounts.map((account) => ({
				provider: account.provider,
				emailAddress: account.emailAddress,
			})),
		};
	}),

	/**
	 * Get basic user info (lighter weight than getMe)
	 */
	getBasicInfo: protectedProcedure.query(async ({ ctx }) => {
		const client = await clerkClient();
		const user = await client.users.getUser(ctx.userId);

		return {
			id: user.id,
			email: user.emailAddresses[0]?.emailAddress ?? null,
			fullName: user.fullName,
			imageUrl: user.imageUrl,
		};
	}),
});
