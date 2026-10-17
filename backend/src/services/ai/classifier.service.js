import { z } from "zod";
import { config } from "../../config/config.js";
import { CATEGORIES, PRIORITIES } from "../../models/ticket.model.js";
import { chat, AiUnavailableError } from "./groq.client.js";
import { CLASSIFY_SYSTEM, classifyUserMessage } from "./prompts.js";

const resultSchema = z.object({
  category: z.enum(CATEGORIES),
  priority: z.enum(PRIORITIES),
  reason: z.string().max(300).optional(),
});

/** One call returns both category and priority (cheaper than two calls). */
export async function classifyTicket({ subject, description, book }) {
  const raw = await chat({
    model: config.GROQ_CLASSIFY_MODEL,
    system: CLASSIFY_SYSTEM,
    user: classifyUserMessage({ subject, description, book }),
    json: true,
    temperature: 0, // classification should be deterministic
    maxTokens: 1000,
    label: "classify",
  });

  try {
    return resultSchema.parse(JSON.parse(raw));
  } catch {
    // Never trust LLM output: anything outside our enums is treated as a failure
    throw new AiUnavailableError("AI returned an invalid classification");
  }
}