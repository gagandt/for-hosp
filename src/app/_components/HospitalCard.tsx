"use client";

interface Hospital {
	id: number;
	name: string;
	address: string;
	phone: string;
	rating: number;
	openingHours: string;
	closingHours: string;
}

interface HospitalCardProps {
	hospital: Hospital;
	onBookClick: (hospital: Hospital) => void;
}

function StarRating({ rating }: { rating: number }) {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<div className="flex items-center gap-1">
			{/* Full stars */}
			{Array.from({ length: fullStars }).map((_, i) => (
				<span className="text-yellow-400" key={`full-${i}`}>
					★
				</span>
			))}
			{/* Half star */}
			{hasHalfStar && <span className="text-yellow-400">★</span>}
			{/* Empty stars */}
			{Array.from({ length: emptyStars }).map((_, i) => (
				<span className="text-gray-300" key={`empty-${i}`}>
					★
				</span>
			))}
			<span className="ml-1 text-gray-600 text-sm">({rating.toFixed(1)})</span>
		</div>
	);
}

export function HospitalCard({ hospital, onBookClick }: HospitalCardProps) {
	const formatTime = (time: string) => {
		const [hours, minutes] = time.split(":");
		const hour = Number.parseInt(hours ?? "0", 10);
		const ampm = hour >= 12 ? "PM" : "AM";
		const formattedHour = hour % 12 || 12;
		return `${formattedHour}:${minutes} ${ampm}`;
	};

	const is24Hours =
		hospital.openingHours === "00:00" && hospital.closingHours === "23:59";

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
			{/* Hospital Name & Rating */}
			<div className="mb-4">
				<h3 className="mb-1 font-semibold text-gray-900 text-lg">
					{hospital.name}
				</h3>
				<StarRating rating={hospital.rating} />
			</div>

			{/* Details */}
			<div className="mb-4 space-y-2 text-sm">
				{/* Phone */}
				<div className="flex items-start gap-2 text-gray-600">
					<span className="mt-0.5">📞</span>
					<span>{hospital.phone}</span>
				</div>

				{/* Address */}
				<div className="flex items-start gap-2 text-gray-600">
					<span className="mt-0.5">📍</span>
					<span>{hospital.address}</span>
				</div>

				{/* Hours */}
				<div className="flex items-start gap-2 text-gray-600">
					<span className="mt-0.5">🕐</span>
					<span>
						{is24Hours
							? "Open 24 Hours"
							: `${formatTime(hospital.openingHours)} - ${formatTime(hospital.closingHours)}`}
					</span>
				</div>
			</div>

			{/* Book Button */}
			<button
				className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-sm text-white transition hover:bg-blue-700"
				onClick={() => onBookClick(hospital)}
				type="button"
			>
				Book Appointment
			</button>
		</div>
	);
}
