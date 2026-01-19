import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Hardcoded hospital data
const hardcodedHospitals = [
	{
		id: 1,
		name: "City General Hospital",
		address: "123 Main Street, Downtown, City 10001",
		phone: "+1 (555) 123-4567",
		rating: 4.5,
		openingHours: "08:00",
		closingHours: "20:00",
	},
	{
		id: 2,
		name: "St. Mary's Medical Center",
		address: "456 Oak Avenue, Westside, City 10002",
		phone: "+1 (555) 234-5678",
		rating: 4.8,
		openingHours: "07:00",
		closingHours: "22:00",
	},
	{
		id: 3,
		name: "Community Health Clinic",
		address: "789 Pine Road, Eastside, City 10003",
		phone: "+1 (555) 345-6789",
		rating: 4.2,
		openingHours: "09:00",
		closingHours: "18:00",
	},
	{
		id: 4,
		name: "Memorial Hospital",
		address: "321 Elm Street, Northside, City 10004",
		phone: "+1 (555) 456-7890",
		rating: 4.6,
		openingHours: "00:00",
		closingHours: "23:59",
	},
	{
		id: 5,
		name: "Sunrise Medical Center",
		address: "654 Maple Drive, Southside, City 10005",
		phone: "+1 (555) 567-8901",
		rating: 4.3,
		openingHours: "06:00",
		closingHours: "21:00",
	},
	{
		id: 6,
		name: "Valley Health Hospital",
		address: "987 Cedar Lane, Valley District, City 10006",
		phone: "+1 (555) 678-9012",
		rating: 4.7,
		openingHours: "08:00",
		closingHours: "19:00",
	},
];

export const hospitalRouter = createTRPCRouter({
	getAll: publicProcedure.query(() => {
		return hardcodedHospitals;
	}),
});
