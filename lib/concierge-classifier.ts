import { z } from "zod";

export const classificationSchema = z.object({
  intent: z.enum([
    "service_request",
    "complaint",
    "exploration",
    "on_demand",
  ]),
  category: z.enum([
    "guide",
    "driver",
    "translator",
    "experience",
    "spa",
    "resort",
    "other",
  ]),
  needsClarification: z.boolean(),
  clarificationHint: z.string().optional(),
});

export type Classification = z.infer<typeof classificationSchema>;

export const classifierSystem = `You classify user messages for guzoAI, an AI travel concierge in Ethiopia (Amharic + English).
Return JSON matching the schema for the latest user turn in context.

intent:
- service_request: needs a driver, guide, translator, transfer, booking
- complaint: room cold, bad service, problem with hotel or experience
- exploration: what to do tonight, bored, ideas, culture vs nightlife
- on_demand: urgent help, translation session, immediate guide

category: best marketplace match — guide, driver, translator, experience, spa, resort, or other.

needsClarification: true ONLY when the category is completely unknown or ambiguous (e.g., "I'm feeling bored" -> need to know if they want nightlife or cultural experience). If the user has already stated or implied a category (like driver, guide, spa, etc.), this MUST be false so we can show them options from our backend. Never ask more than one clarification question before showing options. Optional clarificationHint in English.`;

export function buildConciergeSystem(
  c: Classification,
  suggestionLines: string[],
  lang: string = "en",
): string {
  const languagePrompt =
    lang === "am"
      ? "IMPORTANT: You MUST reply in Amharic (አማርኛ) unless quoting a name."
      : "Reply in English.";

  if (c.needsClarification) {
    return `You are guzoAI — warm, concise concierge for travelers in Ethiopia.
${languagePrompt}
Ask exactly ONE short clarifying question. Hint: ${c.clarificationHint ?? "narrow what they want"}. Do not list providers yet.`;
  }

  const lines =
    suggestionLines.length > 0
      ? `\nReference these real listings (do not invent names or prices):\n${suggestionLines.join("\n")}`
      : `\nCRITICAL: We searched the backend for [${c.category}] and found NO available listings. You MUST inform the user that no providers are currently available for this category. DO NOT offer to find recommendations for this category and DO NOT ask if they want recommendations for it, because we have none.`;

  return `You are guzoAI — warm concierge for Ethiopia.
${languagePrompt}
User intent: ${c.intent}. Category focus: ${c.category}.
Reply helpfully and concisely.
${c.intent === "complaint" ? "Acknowledge the issue; offer practical next steps; do not hard-sell bookings." : ""}
${lines}`;
}
