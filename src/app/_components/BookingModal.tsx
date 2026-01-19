"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

interface Hospital {
	id: number;
	name: string;
	address: string;
	phone: string;
	rating: number;
	openingHours: string;
	closingHours: string;
}

interface BookingModalProps {
	hospital: Hospital;
	isOpen: boolean;
	onClose: () => void;
}

export function BookingModal({ hospital, isOpen, onClose }: BookingModalProps) {
	const router = useRouter();
	const [preferredDate, setPreferredDate] = useState("");
	const [preferredTime, setPreferredTime] = useState("");
	const [reason, setReason] = useState("");
	const [error, setError] = useState("");

	const createBookingMutation = api.booking.create.useMutation({
		onSuccess: () => {
			router.push("/bookings");
		},
		onError: (err) => {
			setError(err.message);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!preferredDate || !preferredTime || !reason.trim()) {
			setError("Please fill in all fields");
			return;
		}

		await createBookingMutation.mutateAsync({
			hospitalId: hospital.id,
			preferredDate,
			preferredTime,
			reason: reason.trim(),
		});
	};

	// Get minimum date (today)
	const today = new Date().toISOString().split("T")[0];

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
				{/* Header */}
				<div className="mb-6">
					<h2 className="font-semibold text-gray-900 text-xl">
						Book Appointment
					</h2>
					<p className="mt-1 text-gray-600 text-sm">{hospital.name}</p>
				</div>

				{/* Form */}
				<form className="space-y-4" onSubmit={handleSubmit}>
					{/* Date */}
					<div>
						<label
							className="mb-1 block font-medium text-gray-700 text-sm"
							htmlFor="date"
						>
							Preferred Date
						</label>
						<input
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							id="date"
							min={today}
							onChange={(e) => setPreferredDate(e.target.value)}
							required
							type="date"
							value={preferredDate}
						/>
					</div>

					{/* Time */}
					<div>
						<label
							className="mb-1 block font-medium text-gray-700 text-sm"
							htmlFor="time"
						>
							Preferred Time
						</label>
						<input
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							id="time"
							onChange={(e) => setPreferredTime(e.target.value)}
							required
							type="time"
							value={preferredTime}
						/>
					</div>

					{/* Reason */}
					<div>
						<label
							className="mb-1 block font-medium text-gray-700 text-sm"
							htmlFor="reason"
						>
							Reason for Visit
						</label>
						<textarea
							className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							id="reason"
							onChange={(e) => setReason(e.target.value)}
							placeholder="Describe your symptoms or reason for the appointment..."
							required
							rows={3}
							value={reason}
						/>
					</div>

					{/* Error */}
					{error && <p className="text-red-600 text-sm">{error}</p>}

					{/* Buttons */}
					<div className="flex gap-3 pt-2">
						<button
							className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 text-sm transition hover:bg-gray-50"
							onClick={onClose}
							type="button"
						>
							Cancel
						</button>
						<button
							className="flex-1 rounded-lg bg-blue-600 py-2.5 font-medium text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={createBookingMutation.isPending}
							type="submit"
						>
							{createBookingMutation.isPending ? "Booking..." : "Book Now"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
