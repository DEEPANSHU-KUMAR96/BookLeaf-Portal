import Groq from "groq-sdk";
import { config } from "../../config/config.js";

/** Single error type for "AI cannot help right now" so callers can degrade gracefully. */
export class AiUnavailableError extends Error { }

// The API key lives only in the server environment. It is never sent to the frontend.
const client = config.GROQ_API_KEY
    ? new Groq({ apiKey: config.GROQ_API_KEY, timeout: 15_000, maxRetries: 2 }) // SDK retries 429 / 5xx
    : null;

/**
 * Thin wrapper around chat completions: one place for timeouts, error mapping
 * and token logging.
 */
export async function chat({ model, system, user, json = false, temperature, maxTokens, label }) {
    if (!client) {
        throw new AiUnavailableError("GROQ_API_KEY is not configured")
    };

    try {
        const res = await client.chat.completions.create({
            model,
            temperature,
            max_tokens: maxTokens,
            // JSON mode requires the word "JSON" to appear in the prompt
            ...(json && { response_format: { type: "json_object" } }),
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        });

        // Token usage per call: this is how we watch cost in production
        const u = res.usage;
        console.log(`[ai:${label}] model=${model} prompt_tokens=${u?.prompt_tokens} completion_tokens=${u?.completion_tokens}`);

        return res.choices[0]?.message?.content?.trim() ?? "";
     } catch (err) {
    // Groq puts the useful explanation in err.error.error.message
    const detail = err.error?.error?.message ?? err.message;
    const reason = err.status === 429 ? "rate limited" : err.status ? `API error ${err.status}: ${detail}` : detail;
    throw new AiUnavailableError(`Groq request failed (${reason})`);
  }
}