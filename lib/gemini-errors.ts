import { APICallError, RetryError } from "ai";

/** Walk RetryError / cause chain to find the underlying API response. */
function findApiCallError(err: unknown): APICallError | undefined {
  if (APICallError.isInstance(err)) return err;
  if (RetryError.isInstance(err)) {
    for (const e of err.errors) {
      const found = findApiCallError(e);
      if (found) return found;
    }
    return findApiCallError(err.lastError);
  }
  if (err && typeof err === "object" && "cause" in err) {
    return findApiCallError((err as { cause: unknown }).cause);
  }
  return undefined;
}

export type GeminiFailure = {
  status: number;
  code: string;
  message: string;
};

/**
 * Maps Gemini / AI SDK errors to HTTP status and a user-facing message.
 * Quota (429) is common on the free tier — not the same as a bad API key.
 */
export function classifyGeminiFailure(err: unknown): GeminiFailure {
  const api = findApiCallError(err);
  const msg =
    err instanceof Error ? err.message : typeof err === "string" ? err : "";

  if (api?.statusCode === 429) {
    return {
      status: 429,
      code: "GEMINI_QUOTA",
      message:
        "Gemini API quota or rate limit was hit (often free-tier daily limits). Wait and retry, enable billing in Google AI Studio, or set GEMINI_MODEL to another model your project can use.",
    };
  }
  if (api?.statusCode === 401 || api?.statusCode === 403) {
    return {
      status: 502,
      code: "GEMINI_AUTH",
      message:
        "Gemini rejected the API key. Check GOOGLE_GENERATIVE_AI_API_KEY and that the Generative Language API is enabled for your project.",
    };
  }
  if (api?.statusCode === 404) {
    return {
      status: 502,
      code: "GEMINI_MODEL",
      message:
        "That Gemini model was not found or is not available for your key. Try another GEMINI_MODEL (e.g. gemini-2.5-flash or gemini-1.5-flash).",
    };
  }

  if (
    /quota|RESOURCE_EXHAUSTED|rate limit|exceeded your current quota/i.test(
      msg,
    )
  ) {
    return {
      status: 429,
      code: "GEMINI_QUOTA",
      message:
        "Gemini API quota or rate limit was hit. Wait and retry, enable billing, or change GEMINI_MODEL.",
    };
  }

  return {
    status: 502,
    code: "GEMINI_UPSTREAM",
    message:
      "Could not reach Gemini. Check GOOGLE_GENERATIVE_AI_API_KEY, GEMINI_MODEL, and https://ai.google.dev/gemini-api/docs/rate-limits",
  };
}
