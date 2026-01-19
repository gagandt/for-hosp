"use client";

import { AdminBookingCard } from "~/app/_components/AdminBookingCard";
import { api } from "~/trpc/react";

export default function AdminPage() {
	const { data: bookings, isLoading, error } = api.booking.getAll.useQuery();

	if (isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="text-gray-500">Loading all bookings...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center">
				<div className="mb-4 text-5xl">🔒</div>
				<h3 className="mb-2 font-semibold text-gray-900 text-lg">
					Access Denied
				</h3>
				<p className="text-gray-600 text-sm">
					You don&apos;t have permission to access this page.
				</p>
			</div>
		);
	}

	// Group bookings by status
	const pendingBookings = bookings?.filter((b) => b.status === "pending") ?? [];
	const confirmedBookings =
		bookings?.filter((b) => b.status === "confirmed") ?? [];
	const cancelledBookings =
		bookings?.filter((b) => b.status === "cancelled") ?? [];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="font-bold text-2xl text-gray-900">Admin Panel</h1>
				<p className="mt-1 text-gray-600 text-sm">
					Manage all hospital bookings
				</p>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-lg bg-yellow-50 p-4">
					<p className="font-bold text-2xl text-yellow-800">
						{pendingBookings.length}
					</p>
					<p className="text-sm text-yellow-600">Pending Bookings</p>
				</div>
				<div className="rounded-lg bg-green-50 p-4">
					<p className="font-bold text-2xl text-green-800">
						{confirmedBookings.length}
					</p>
					<p className="text-green-600 text-sm">Confirmed Bookings</p>
				</div>
				<div className="rounded-lg bg-red-50 p-4">
					<p className="font-bold text-2xl text-red-800">
						{cancelledBookings.length}
					</p>
					<p className="text-red-600 text-sm">Cancelled Bookings</p>
				</div>
			</div>

			{/* Pending Bookings Section */}
			{pendingBookings.length > 0 && (
				<div>
					<h2 className="mb-4 font-semibold text-gray-900 text-lg">
						Pending Bookings ({pendingBookings.length})
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{pendingBookings.map((booking) => (
							<AdminBookingCard booking={booking} key={booking.id} />
						))}
					</div>
				</div>
			)}

			{/* Confirmed Bookings Section */}
			{confirmedBookings.length > 0 && (
				<div>
					<h2 className="mb-4 font-semibold text-gray-900 text-lg">
						Confirmed Bookings ({confirmedBookings.length})
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{confirmedBookings.map((booking) => (
							<AdminBookingCard booking={booking} key={booking.id} />
						))}
					</div>
				</div>
			)}

			{/* Cancelled Bookings Section */}
			{cancelledBookings.length > 0 && (
				<div>
					<h2 className="mb-4 font-semibold text-gray-900 text-lg">
						Cancelled Bookings ({cancelledBookings.length})
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{cancelledBookings.map((booking) => (
							<AdminBookingCard booking={booking} key={booking.id} />
						))}
					</div>
				</div>
			)}

			{/* Empty State */}
			{bookings?.length === 0 && (
				<div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center">
					<div className="mb-4 text-5xl">📋</div>
					<h3 className="mb-2 font-semibold text-gray-900 text-lg">
						No bookings yet
					</h3>
					<p className="text-gray-600 text-sm">
						There are no hospital bookings in the system yet.
					</p>
				</div>
			)}
		</div>
	);
}
