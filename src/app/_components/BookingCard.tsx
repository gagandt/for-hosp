"use client";

import { api } from "~/trpc/react";

type BookingStatus = "pending" | "confirmed" | "cancelled";

interface Booking {
	id: number;
	userId: string;
	hospitalId: number;
	preferredDate: string;
	preferredTime: string;
	reason: string;
	status: BookingStatus;
	createdAt: Date;
	confirmedAt: Date | null;
	hospital: {
		id: number;
		name: string;
		address: string;
		phone: string;
		rating: number;
		openingHours: string;
		closingHours: string;
		createdAt: Date;
	};
}

interface BookingCardProps {
	booking: Booking;
}

function StatusBadge({ status }: { status: BookingStatus }) {
	const styles = {
		pending: "bg-yellow-100 text-yellow-800",
		confirmed: "bg-green-100 text-green-800",
		cancelled: "bg-red-100 text-red-800",
	};

	const labels = {
		pending: "Pending",
		confirmed: "Confirmed",
		cancelled: "Cancelled",
	};

	return (
		<span
			className={`rounded-full px-3 py-1 font-medium text-xs ${styles[status]}`}
		>
			{labels[status]}
		</span>
	);
}

export function BookingCard({ booking }: BookingCardProps) {
	const utils = api.useUtils();

	const cancelMutation = api.booking.cancel.useMutation({
		onSuccess: () => {
			void utils.booking.getMyBookings.invalidate();
		},
	});

	const handleCancel = async () => {
		if (confirm("Are you sure you want to cancel this booking?")) {
			await cancelMutation.mutateAsync({ bookingId: booking.id });
		}
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatTime = (time: string) => {
		const [hours, minutes] = time.split(":");
		const hour = Number.parseInt(hours ?? "0", 10);
		const ampm = hour >= 12 ? "PM" : "AM";
		const formattedHour = hour % 12 || 12;
		return `${formattedHour}:${minutes} ${ampm}`;
	};

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			{/* Header */}
			<div className="mb-4 flex items-start justify-between">
				<div>
					<h3 className="font-semibold text-gray-900 text-lg">
						{booking.hospital.name}
					</h3>
					<p className="text-gray-500 text-sm">{booking.hospital.address}</p>
				</div>
				<StatusBadge status={booking.status} />
			</div>

			{/* Booking Details */}
			<div className="mb-4 space-y-2 text-sm">
				<div className="flex items-center gap-2 text-gray-600">
					<span>📅</span>
					<span>{formatDate(booking.preferredDate)}</span>
				</div>
				<div className="flex items-center gap-2 text-gray-600">
					<span>🕐</span>
					<span>{formatTime(booking.preferredTime)}</span>
				</div>
				<div className="flex items-start gap-2 text-gray-600">
					<span>📝</span>
					<span className="line-clamp-2">{booking.reason}</span>
				</div>
			</div>

			{/* Cancel Button */}
			{booking.status === "pending" && (
				<button
					className="w-full rounded-lg border border-red-300 py-2 font-medium text-red-600 text-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={cancelMutation.isPending}
					onClick={handleCancel}
					type="button"
				>
					{cancelMutation.isPending ? "Cancelling..." : "Cancel Booking"}
				</button>
			)}
		</div>
	);
}
