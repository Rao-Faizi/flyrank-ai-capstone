import { z } from 'zod';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ScriptInput, SalesScript } from '../types/script';

// Zod schema for strict validation of the AI's JSON response
const SalesScriptSchema = z.object({
  subjectLine: z.string().min(1),
  openingHook: z.string().min(1),
  valueProposition: z.string().min(1),
  socialProof: z.string().min(1),
  callToAction: z.string().min(1),
});

const PROMPT_INSTRUCTIONS = `Return a JSON object with exactly these five fields:
- "subjectLine": A compelling, specific subject line (max 8 words)
- "openingHook": A 1-2 sentence personalized opening referencing the company/industry
- "valueProposition": 2-3 sentences on what problem you solve for them specifically
- "socialProof": 1 sentence social proof or credibility signal (use [Company X] placeholder if needed)
- "callToAction": A single, low-friction CTA sentence`;

function buildUserPrompt(input: ScriptInput): string {
  return `Generate a cold outreach email for:
Company: ${input.companyName}
Industry: ${input.industry}
Product Value Bullets:
${input.productBullets}
${input.yourName ? `Sender: ${input.yourName}` : ''}

${PROMPT_INSTRUCTIONS}`;
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────
async function generateWithOpenAI(input: ScriptInput): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing VITE_OPENAI_API_KEY in your .env.local file.');

  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are an expert B2B sales copywriter. Always respond with valid JSON only.' },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });
    const content = res.choices[0]?.message?.content ?? '';
    if (!content) throw new Error('Empty response from OpenAI.');
    return content;
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('401') || msg.includes('Incorrect API key')) throw new Error('Invalid OpenAI API key.');
    if (msg.includes('429')) throw new Error('OpenAI rate limit reached. Please wait and try again.');
    throw new Error('Failed to reach OpenAI. Please check your connection and try again.');
  }
}

// ─── Gemini ───────────────────────────────────────────────────────────────────
async function generateWithGemini(input: ScriptInput): Promise<string> {
  const apiKey = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error('Missing VITE_GOOGLE_GENERATIVE_AI_API_KEY in your .env.local file.');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are an expert B2B sales copywriter. ${buildUserPrompt(input)}\n\nReturn ONLY valid JSON. No markdown, no code blocks.`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text()
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();
    if (!raw) throw new Error('Empty response from Gemini.');
    return raw;
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('API_KEY_INVALID') || msg.includes('401')) throw new Error('Invalid Gemini API key.');
    if (msg.includes('429')) throw new Error('Gemini rate limit reached. Please wait and try again.');
    throw new Error('Failed to reach Gemini. Please check your connection and try again.');
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateScript(input: ScriptInput): Promise<SalesScript> {
  const raw = input.provider === 'openai'
    ? await generateWithOpenAI(input)
    : await generateWithGemini(input);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('The AI returned an unexpected format. Please try again.');
  }

  const validated = SalesScriptSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error('The AI response was incomplete. Please try again.');
  }

  return validated.data;
}
