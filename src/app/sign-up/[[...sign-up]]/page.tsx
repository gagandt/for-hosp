import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
			<SignUp
				appearance={{
					elements: {
						formButtonPrimary:
							"bg-purple-600 hover:bg-purple-700 text-sm normal-case",
					},
				}}
			/>
		</div>
	);
}
