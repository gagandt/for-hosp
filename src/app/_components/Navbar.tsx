"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
	{ href: "/home", label: "Home" },
	{ href: "/chatbot", label: "Chatbot" },
	{ href: "/hospitals", label: "Near Hospitals" },
	{ href: "/bookings", label: "My Bookings" },
];

export function Navbar() {
	const pathname = usePathname();

	return (
		<nav className="border-gray-200 border-b bg-white shadow-sm">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
				{/* Logo */}
				<Link className="flex items-center gap-2" href="/home">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-lg text-white">
						+
					</div>
					<span className="font-semibold text-gray-900 text-lg">AI Health</span>
				</Link>

				{/* Navigation Links */}
				<div className="flex items-center gap-1">
					{navLinks.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								className={`rounded-lg px-4 py-2 font-medium text-sm transition ${
									isActive
										? "bg-blue-100 text-blue-700"
										: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
								}`}
								href={link.href}
								key={link.href}
							>
								{link.label}
							</Link>
						);
					})}
				</div>

				{/* User Menu */}
				<div className="flex items-center gap-4">
					<UserButton
						afterSignOutUrl="/"
						appearance={{
							elements: {
								avatarBox: "h-9 w-9",
							},
						}}
					/>
				</div>
			</div>
		</nav>
	);
}
