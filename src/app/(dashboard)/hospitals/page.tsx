"use client";

import { useState } from "react";
import { BookingModal } from "~/app/_components/BookingModal";
import { HospitalCard } from "~/app/_components/HospitalCard";
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

export default function HospitalsPage() {
	const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
		null,
	);

	const { data: hospitals, isLoading } = api.hospital.getAll.useQuery();

	const handleBookClick = (hospital: Hospital) => {
		setSelectedHospital(hospital);
	};

	const handleCloseModal = () => {
		setSelectedHospital(null);
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="text-gray-500">Loading hospitals...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-bold text-2xl text-gray-900">Near Hospitals</h1>
				<p className="mt-1 text-gray-600 text-sm">
					Browse hospitals near you and book appointments
				</p>
			</div>

			{/* Hospital Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{hospitals?.map((hospital) => (
					<HospitalCard
						hospital={hospital}
						key={hospital.id}
						onBookClick={handleBookClick}
					/>
				))}
			</div>

			{/* Booking Modal */}
			{selectedHospital && (
				<BookingModal
					hospital={selectedHospital}
					isOpen={!!selectedHospital}
					onClose={handleCloseModal}
				/>
			)}
		</div>
	);
}
