import Link from "next/link";

export default function HomePage() {
	return (
		<div className="space-y-8">
			{/* Welcome Section */}
			<div className="text-center">
				<h1 className="font-bold text-3xl text-gray-900">
					Welcome to AI Health Assistant
				</h1>
				<p className="mt-2 text-gray-600">
					Your personal health companion - get guidance and book appointments
					easily
				</p>
			</div>

			{/* Feature Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* AI Chatbot Card */}
				<Link
					className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
					href="/chatbot"
				>
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
						💬
					</div>
					<h2 className="mb-2 font-semibold text-gray-900 text-xl group-hover:text-blue-600">
						AI Health Chatbot
					</h2>
					<p className="text-gray-600 text-sm">
						Chat with our AI assistant to get instant health guidance, ask
						questions about symptoms, and receive wellness recommendations.
						Available 24/7.
					</p>
					<div className="mt-4 font-medium text-blue-600 text-sm">
						Start chatting →
					</div>
				</Link>

				{/* Find Hospitals Card */}
				<Link
					className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
					href="/hospitals"
				>
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl">
						🏥
					</div>
					<h2 className="mb-2 font-semibold text-gray-900 text-xl group-hover:text-blue-600">
						Near Hospitals
					</h2>
					<p className="text-gray-600 text-sm">
						Browse hospitals near you with detailed information including
						ratings, contact details, and operating hours. Find the right
						healthcare facility.
					</p>
					<div className="mt-4 font-medium text-blue-600 text-sm">
						View hospitals →
					</div>
				</Link>

				{/* My Bookings Card */}
				<Link
					className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
					href="/bookings"
				>
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl">
						📅
					</div>
					<h2 className="mb-2 font-semibold text-gray-900 text-xl group-hover:text-blue-600">
						My Bookings
					</h2>
					<p className="text-gray-600 text-sm">
						View and manage your hospital appointments. Track booking status,
						see confirmed appointments, and cancel if needed.
					</p>
					<div className="mt-4 font-medium text-blue-600 text-sm">
						View bookings →
					</div>
				</Link>
			</div>

			{/* Quick Tips Section */}
			<div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
				<h3 className="mb-3 font-semibold text-blue-900 text-lg">
					Quick Health Tips
				</h3>
				<ul className="space-y-2 text-blue-800 text-sm">
					<li className="flex items-start gap-2">
						<span>•</span>
						<span>
							Use the AI chatbot for general health questions - it&apos;s
							available 24/7
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span>•</span>
						<span>
							Always consult a real doctor for serious symptoms or emergencies
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span>•</span>
						<span>
							Book appointments in advance to secure your preferred time slot
						</span>
					</li>
					<li className="flex items-start gap-2">
						<span>•</span>
						<span>
							Keep track of your bookings and don&apos;t forget to attend your
							appointments
						</span>
					</li>
				</ul>
			</div>
		</div>
	);
}
