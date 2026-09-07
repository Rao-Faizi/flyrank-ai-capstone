import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
 * Builds the structured prompt for Gemini.
 * We explicitly instruct it to return JSON only — no markdown, no fluff.
 */
function buildPrompt(input: ScriptInput): string {
  return `You are an expert B2B sales copywriter. Generate a cold outreach email for the following prospect.

Company Name: ${input.companyName}
Industry: ${input.industry}
Product/Value Bullets:
${input.productBullets}
${input.yourName ? `Sender Name: ${input.yourName}` : ''}

Return ONLY a valid JSON object with exactly these five fields. No markdown, no code blocks, no explanation:
{
  "subjectLine": "A compelling, specific subject line (max 8 words)",
  "openingHook": "A 1-2 sentence personalized opening referencing the company/industry",
  "valueProposition": "2-3 sentences on what problem you solve for them specifically",
  "socialProof": "1 sentence social proof or credibility signal (use a placeholder like [Company X] if needed)",
  "callToAction": "A single, low-friction CTA sentence"
}`;
}

/**
 * Main AI generation function.
 * Calls Gemini, parses the response, and validates it with Zod.
 * Throws a typed Error on failure so the hook can handle it gracefully.
 */
export async function generateScript(input: ScriptInput): Promise<SalesScript> {
  const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing API key. Please set VITE_GOOGLE_GENERATIVE_AI_API_KEY in your .env.local file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = buildPrompt(input);

  let rawText: string;
  try {
    const result = await model.generateContent(prompt);
    rawText = result.response.text();
  } catch (err) {
    throw new Error('Failed to reach the AI service. Please check your connection and try again.');
  }

  // Strip markdown code fences if Gemini wraps in them anyway
  const cleaned = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('The AI returned an unexpected format. Please try again.');
  }

  // Zod validation — ensures we never render half-baked data
  const validated = SalesScriptSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error('The AI response was incomplete. Please try again.');
  }

  return validated.data;
}
