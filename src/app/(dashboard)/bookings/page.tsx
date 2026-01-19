"use client";

import Link from "next/link";
import { BookingCard } from "~/app/_components/BookingCard";
import { api } from "~/trpc/react";

export default function BookingsPage() {
	const { data: bookings, isLoading } = api.booking.getMyBookings.useQuery();

	if (isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="text-gray-500">Loading your bookings...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-bold text-2xl text-gray-900">My Bookings</h1>
				<p className="mt-1 text-gray-600 text-sm">
					View and manage your hospital appointments
				</p>
			</div>

			{/* Bookings List */}
			{bookings && bookings.length > 0 ? (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{bookings.map((booking) => (
						<BookingCard booking={booking} key={booking.id} />
					))}
				</div>
			) : (
				<div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center">
					<div className="mb-4 text-5xl">📅</div>
					<h3 className="mb-2 font-semibold text-gray-900 text-lg">
						No bookings yet
					</h3>
					<p className="mb-4 max-w-sm text-gray-600 text-sm">
						You haven&apos;t made any hospital appointments yet. Browse nearby
						hospitals to book your first appointment.
					</p>
					<Link
						className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-sm text-white transition hover:bg-blue-700"
						href="/hospitals"
					>
						Browse Hospitals
					</Link>
				</div>
			)}
		</div>
	);
}
