import { z } from 'zod';
import OpenAI from 'openai';
import type { ScriptInput, SalesScript } from '../types/script';

// Zod schema for strict validation of the AI's JSON response
const SalesScriptSchema = z.object({
  subjectLine: z.string().min(1, 'Subject line is required'),
  openingHook: z.string().min(1, 'Opening hook is required'),
  valueProposition: z.string().min(1, 'Value proposition is required'),
  socialProof: z.string().min(1, 'Social proof is required'),
  callToAction: z.string().min(1, 'Call to action is required'),
});

/**
 * Builds the structured prompt.
 * We use OpenAI's JSON mode so the model is forced to return valid JSON only.
 */
function buildPrompt(input: ScriptInput): string {
  return `You are an expert B2B sales copywriter. Generate a cold outreach email for the following prospect.

Company Name: ${input.companyName}
Industry: ${input.industry}
Product/Value Bullets:
${input.productBullets}
${input.yourName ? `Sender Name: ${input.yourName}` : ''}

Return a JSON object with exactly these five fields:
- "subjectLine": A compelling, specific subject line (max 8 words)
- "openingHook": A 1-2 sentence personalized opening referencing the company/industry
- "valueProposition": 2-3 sentences on what problem you solve for them specifically
- "socialProof": 1 sentence social proof or credibility signal (use [Company X] placeholder if needed)
- "callToAction": A single, low-friction CTA sentence`;
}

/**
 * Main AI generation function using OpenAI (ChatGPT).
 * Uses JSON mode to guarantee valid JSON output.
 * Validated with Zod before returning to keep the UI type-safe.
 */
export async function generateScript(input: ScriptInput): Promise<SalesScript> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing API key. Please set VITE_OPENAI_API_KEY in your .env.local file.');
  }

  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  let rawContent: string | null;
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and cheap — perfect for structured output
      response_format: { type: 'json_object' }, // Forces valid JSON output
      messages: [
        {
          role: 'system',
          content: 'You are an expert B2B sales copywriter. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: buildPrompt(input),
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    rawContent = response.choices[0]?.message?.content ?? null;
    if (!rawContent) throw new Error('Empty response from AI.');
  } catch (err) {
    // Surface OpenAI-specific errors with a clear message
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('401') || message.includes('Incorrect API key')) {
      throw new Error('Invalid API key. Please check your VITE_OPENAI_API_KEY.');
    }
    if (message.includes('429')) {
      throw new Error('Rate limit reached. Please wait a moment and try again.');
    }
    throw new Error('Failed to reach the AI service. Please check your connection and try again.');
  }

  // Parse and Zod-validate — never render half-baked data
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error('The AI returned an unexpected format. Please try again.');
  }

  const validated = SalesScriptSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error('The AI response was incomplete. Please try again.');
  }

  return validated.data;
}
