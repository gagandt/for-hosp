import { ChatWindow } from "~/app/_components/ChatWindow";
import { api } from "~/trpc/server";

export default async function ChatbotPage() {
	const chatHistory = await api.chat.getHistory();

	return (
		<div className="space-y-4">
			<div>
				<h1 className="font-bold text-2xl text-gray-900">AI Health Chatbot</h1>
				<p className="mt-1 text-gray-600 text-sm">
					Ask questions about your health concerns and get instant guidance
				</p>
			</div>

			<ChatWindow initialMessages={chatHistory} />
		</div>
	);
}
