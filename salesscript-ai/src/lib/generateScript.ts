import { z } from 'zod';
import type { ScriptInput, SalesScript } from '../types/script';

// Zod schema for strict validation of the API response
const SalesScriptSchema = z.object({
  subjectLine: z.string().min(1),
  openingHook: z.string().min(1),
  valueProposition: z.string().min(1),
  socialProof: z.string().min(1),
  callToAction: z.string().min(1),
});

/**
 * Calls our own Vercel serverless function at /api/generate.
 * The API keys (OpenAI / Gemini) live on the SERVER — never in the browser bundle.
 * This is the production-safe pattern for client-side Vite apps.
 */
export async function generateScript(input: ScriptInput): Promise<SalesScript> {
  let response: Response;
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: input.companyName,
        industry: input.industry,
        productBullets: input.productBullets,
        yourName: input.yourName,
        provider: input.provider,
      }),
    });
  } catch {
    throw new Error('Network error. Please check your connection and try again.');
  }

  const data = await response.json();

  if (!response.ok) {
    // Surface the server-side error message directly
    throw new Error(data?.error ?? 'An unexpected error occurred. Please try again.');
  }

  // Zod-validate before rendering — never trust raw API output
  const validated = SalesScriptSchema.safeParse(data);
  if (!validated.success) {
    throw new Error('The AI response was incomplete. Please try again.');
  }

  return validated.data;
}
