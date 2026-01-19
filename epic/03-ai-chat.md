## 03. Create AI chat API route with Vercel AI SDK

Task User Flow:
- 👤 User sends message
- 📟 AI processes and streams response (3-10 seconds)

## API Route Specification

### POST /api/chat

Request body:
- messages: array of { role: "user" | "assistant", content: string }

Response:
- Streaming text response using Vercel AI SDK streamText

### Configuration

Model: openai("gpt-4.1")

System prompt:
"You are a friendly AI health assistant. Your role is to:
1. Listen to the user's health concerns with empathy
2. Ask clarifying follow-up questions to understand their symptoms better
3. Provide general health information and guidance
4. ALWAYS recommend consulting a real doctor for proper diagnosis and treatment
5. Never provide definitive diagnoses or prescribe medications
6. If symptoms sound serious or urgent, strongly encourage seeking immediate medical attention
7. Be warm, supportive, and conversational in tone

Remember: You are not a replacement for professional medical advice. Always encourage users to visit a healthcare provider."

### Dependencies
- @ai-sdk/openai
- ai (Vercel AI SDK)

### Environment
- OPENAI_API_KEY in .env

## Checklist

- [ ] Install: bun add ai @ai-sdk/openai
- [ ] Create src/app/api/chat/route.ts
- [ ] Import openai from @ai-sdk/openai, streamText from ai
- [ ] Create POST handler that extracts messages from request body
- [ ] Call streamText with model, system prompt, messages
- [ ] Return result.toDataStreamResponse()
- [ ] Add OPENAI_API_KEY to .env

## Files
- src/app/api/chat/route.ts
- .env (add OPENAI_API_KEY)
