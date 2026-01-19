import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
	const { userId } = await auth();

	// If user is signed in, redirect to dashboard
	if (userId) {
		redirect("/home");
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
			<div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
				{/* Logo/Brand */}
				<div className="flex items-center gap-3">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-3xl text-white">
						+
					</div>
					<h1 className="font-bold text-4xl text-gray-900">
						AI Health Assistant
					</h1>
				</div>

				{/* Description */}
				<p className="max-w-md text-gray-600 text-lg">
					Get health guidance from our AI assistant and book appointments at
					nearby hospitals - all in one place.
				</p>

				{/* Auth Section */}
				<SignedOut>
					<div className="flex flex-col items-center gap-6">
						<p className="font-medium text-gray-800 text-xl">
							Please login to continue
						</p>
						<div className="flex gap-4">
							<SignInButton mode="modal">
								<button
									className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
									type="button"
								>
									Sign In
								</button>
							</SignInButton>
							<SignUpButton mode="modal">
								<button
									className="rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
									type="button"
								>
									Sign Up
								</button>
							</SignUpButton>
						</div>
					</div>
				</SignedOut>

				{/* Features Preview */}
				<div className="mt-8 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
					<div className="rounded-xl bg-white p-6 shadow-md">
						<div className="mb-3 text-3xl">💬</div>
						<h3 className="mb-2 font-semibold text-gray-900">AI Chatbot</h3>
						<p className="text-gray-600 text-sm">
							Get instant health guidance from our AI assistant
						</p>
					</div>
					<div className="rounded-xl bg-white p-6 shadow-md">
						<div className="mb-3 text-3xl">🏥</div>
						<h3 className="mb-2 font-semibold text-gray-900">Find Hospitals</h3>
						<p className="text-gray-600 text-sm">
							Browse nearby hospitals and their details
						</p>
					</div>
					<div className="rounded-xl bg-white p-6 shadow-md">
						<div className="mb-3 text-3xl">📅</div>
						<h3 className="mb-2 font-semibold text-gray-900">
							Book Appointments
						</h3>
						<p className="text-gray-600 text-sm">
							Schedule visits with doctors easily
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
