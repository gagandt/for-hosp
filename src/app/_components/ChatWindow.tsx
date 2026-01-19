"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";

interface SavedMessage {
	id: number;
	role: "user" | "assistant";
	content: string;
	createdAt: Date;
}

interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
}

interface ChatWindowProps {
	initialMessages: SavedMessage[];
}

export function ChatWindow({ initialMessages }: ChatWindowProps) {
	const [messages, setMessages] = useState<ChatMessage[]>(() =>
		initialMessages.map((msg) => ({
			id: String(msg.id),
			role: msg.role,
			content: msg.content,
		})),
	);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const utils = api.useUtils();

	const saveMessageMutation = api.chat.saveMessage.useMutation();

	// Auto-scroll to bottom when new messages arrive
	const messagesLength = messages.length;
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messagesLength]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!input.trim() || isLoading) return;

			const userMessage = input.trim();
			setInput("");

			// Add user message to UI
			const userMsgId = String(Date.now());
			setMessages((prev) => [
				...prev,
				{ id: userMsgId, role: "user", content: userMessage },
			]);

			// Save user message to database
			await saveMessageMutation.mutateAsync({
				role: "user",
				content: userMessage,
			});

			setIsLoading(true);

			try {
				// Send to AI API
				const response = await fetch("/api/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						messages: [
							...messages.map((m) => ({ role: m.role, content: m.content })),
							{ role: "user", content: userMessage },
						],
					}),
				});

				if (!response.ok) {
					throw new Error("Failed to get response");
				}

				// Read streaming response
				const reader = response.body?.getReader();
				if (!reader) throw new Error("No reader");

				const decoder = new TextDecoder();
				let assistantContent = "";
				const assistantMsgId = String(Date.now() + 1);

				// Add placeholder for assistant message
				setMessages((prev) => [
					...prev,
					{ id: assistantMsgId, role: "assistant", content: "" },
				]);

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });
					assistantContent += chunk;

					// Update assistant message content
					setMessages((prev) =>
						prev.map((m) =>
							m.id === assistantMsgId ? { ...m, content: assistantContent } : m,
						),
					);
				}

				// Save assistant message to database
				if (assistantContent) {
					await saveMessageMutation.mutateAsync({
						role: "assistant",
						content: assistantContent,
					});
					void utils.chat.getHistory.invalidate();
				}
			} catch (error) {
				console.error("Chat error:", error);
				// Add error message
				setMessages((prev) => [
					...prev,
					{
						id: String(Date.now() + 2),
						role: "assistant",
						content: "Sorry, I encountered an error. Please try again.",
					},
				]);
			} finally {
				setIsLoading(false);
			}
		},
		[input, isLoading, messages, saveMessageMutation, utils.chat.getHistory],
	);

	return (
		<div className="flex h-[calc(100vh-12rem)] flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
			{/* Chat Messages */}
			<div className="flex-1 overflow-y-auto p-4">
				{messages.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
						<div className="mb-4 text-5xl">💬</div>
						<h3 className="mb-2 font-semibold text-gray-700 text-lg">
							Start a conversation
						</h3>
						<p className="max-w-sm text-sm">
							Ask me about your health concerns, symptoms, or general wellness
							questions. I&apos;m here to help!
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{messages.map((message) => (
							<div
								className={`flex ${
									message.role === "user" ? "justify-end" : "justify-start"
								}`}
								key={message.id}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-3 ${
										message.role === "user"
											? "bg-blue-600 text-white"
											: "bg-gray-100 text-gray-800"
									}`}
								>
									<p className="whitespace-pre-wrap text-sm">
										{message.content}
									</p>
								</div>
							</div>
						))}
						{isLoading && messages[messages.length - 1]?.role === "user" && (
							<div className="flex justify-start">
								<div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-3">
									<div className="flex items-center gap-1">
										<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
										<div
											className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
											style={{ animationDelay: "0.1s" }}
										/>
										<div
											className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
											style={{ animationDelay: "0.2s" }}
										/>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Input Form */}
			<form className="border-gray-200 border-t p-4" onSubmit={handleSubmit}>
				<div className="flex gap-3">
					<input
						className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						disabled={isLoading}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type your health question..."
						type="text"
						value={input}
					/>
					<button
						className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isLoading || !input.trim()}
						type="submit"
					>
						{isLoading ? "..." : "Send"}
					</button>
				</div>
			</form>
		</div>
	);
}
