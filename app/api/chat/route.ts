import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
  streamText,
  type UIMessage,
} from "ai";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import {
  buildConciergeSystem,
  classifierSystem,
  classificationSchema,
} from "@/lib/concierge-classifier";
import { getTextFromUIMessage } from "@/lib/message-text";
import { ChatSession } from "@/lib/models/chat-session";
import type { ProviderCategory } from "@/lib/models/provider";
import { classifyGeminiFailure } from "@/lib/gemini-errors";
import { getTopProvidersForCategory } from "@/lib/provider-query";

export const maxDuration = 60;

const modelId = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

export async function POST(req: Request) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const b = body as {
    messages?: unknown;
    sessionId?: unknown;
  };

  if (!Array.isArray(b.messages)) {
    return new Response("Expected messages array", { status: 400 });
  }

  const messages = b.messages as UIMessage[];
  const sessionId =
    typeof b.sessionId === "string" && b.sessionId.length > 0
      ? b.sessionId
      : randomUUID();

  const modelMessages = await convertToModelMessages(messages);

  let classification;
  try {
    const result = await generateObject({
      model: google(modelId),
      schema: classificationSchema,
      system: classifierSystem,
      messages: modelMessages,
      maxRetries: 0,
    });
    classification = result.object;
  } catch (e) {
    console.error("concierge classify", e);
    const { status, code, message } = classifyGeminiFailure(e);
    return new Response(JSON.stringify({ error: message, code }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  let suggestions = await (async () => {
    if (classification.needsClarification) return [];
    if (classification.intent === "complaint") return [];
    const cat = classification.category;
    if (cat === "other") {
      return getTopProvidersForCategory("other", 3);
    }
    return getTopProvidersForCategory(cat as ProviderCategory, 3);
  })();

  const suggestionLines = suggestions.map(
    (s, i) =>
      `${i + 1}. ${s.name} (${s.category}) — ${s.price} ETB — ${s.languages.join(", ")} — ${s.description}`,
  );

  const system = buildConciergeSystem(classification, suggestionLines);

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const userText = lastUser ? getTextFromUIMessage(lastUser) : "";

  const stream = createUIMessageStream({
    originalMessages: messages,
    async execute({ writer }) {
      try {
        if (suggestions.length > 0) {
          writer.write({
            type: "data-suggestions",
            data: suggestions,
          });
        }
        const result = streamText({
          model: google(modelId),
          system,
          messages: modelMessages,
          maxRetries: 0,
        });
        writer.merge(result.toUIMessageStream());
      } catch (e) {
        writer.write({
          type: "error",
          errorText:
            e instanceof Error ? e.message : "Concierge stream failed.",
        });
      }
    },
    onFinish: async ({ responseMessage }) => {
      const assistantText = getTextFromUIMessage(responseMessage);
      try {
        await ChatSession.findOneAndUpdate(
          { userId: session.user.id, sessionId },
          {
            $set: { lastIntent: classification.intent },
            $push: {
              messages: {
                $each: [
                  {
                    role: "user",
                    content: userText,
                    intent: classification.intent,
                  },
                  {
                    role: "assistant",
                    content: assistantText,
                    intent: classification.intent,
                    suggestionIds: suggestions.map((s) => s.id),
                  },
                ],
              },
            },
          },
          { upsert: true },
        );
      } catch (err) {
        console.error("chat session persist", err);
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}
