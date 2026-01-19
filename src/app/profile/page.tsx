"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { api } from "~/trpc/react";

export default function ProfilePage() {
	const { data: user, isLoading, error } = api.user.getMe.useQuery();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<div className="text-2xl text-white">Loading profile...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<div className="text-2xl text-red-400">
					Error loading profile: {error.message}
				</div>
			</div>
		);
	}

	return (
		<main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white">
			<div className="container flex max-w-2xl flex-col items-center gap-8">
				<div className="flex w-full items-center justify-between">
					<Link
						className="rounded-full bg-white/10 px-4 py-2 font-semibold transition hover:bg-white/20"
						href="/"
					>
						← Back to Home
					</Link>
					<UserButton afterSignOutUrl="/" />
				</div>

				<h1 className="font-extrabold text-4xl tracking-tight">Your Profile</h1>

				<div className="w-full rounded-xl bg-white/10 p-6">
					<div className="flex flex-col items-center gap-6">
						{user?.imageUrl && (
							<Image
								alt="Profile"
								className="rounded-full border-4 border-purple-500"
								height={96}
								src={user.imageUrl}
								width={96}
							/>
						)}

						<div className="w-full space-y-4">
							<ProfileField label="Full Name" value={user?.fullName} />
							<ProfileField label="Email" value={user?.email} />
							<ProfileField label="Username" value={user?.username} />
							<ProfileField
								label="Email Verified"
								value={user?.emailVerified ? "Yes" : "No"}
							/>
							<ProfileField
								label="Member Since"
								value={
									user?.createdAt
										? new Date(user.createdAt).toLocaleDateString()
										: null
								}
							/>
							<ProfileField
								label="Last Sign In"
								value={
									user?.lastSignInAt
										? new Date(user.lastSignInAt).toLocaleDateString()
										: null
								}
							/>

							{user?.externalAccounts && user.externalAccounts.length > 0 && (
								<div className="pt-4">
									<h3 className="mb-2 font-semibold text-lg text-purple-300">
										Connected Accounts
									</h3>
									<div className="space-y-2">
										{user.externalAccounts.map((account) => (
											<div
												className="flex items-center gap-2 rounded bg-white/5 px-3 py-2"
												key={`${account.provider}-${account.emailAddress}`}
											>
												<span className="capitalize">{account.provider}</span>
												<span className="text-gray-400">-</span>
												<span className="text-gray-300">
													{account.emailAddress}
												</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

function ProfileField({
	label,
	value,
}: {
	label: string;
	value: string | null | undefined;
}) {
	return (
		<div className="flex flex-col gap-1 border-white/10 border-b pb-2">
			<span className="text-purple-300 text-sm">{label}</span>
			<span className="text-lg">{value ?? "Not set"}</span>
		</div>
	);
}
