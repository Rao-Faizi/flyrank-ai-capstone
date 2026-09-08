import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = 'You are an expert B2B sales copywriter. Always respond with valid JSON only.';

function buildUserPrompt(body: {
  companyName: string;
  industry: string;
  productBullets: string;
  yourName?: string;
}): string {
  return `Generate a cold outreach email for:
Company: ${body.companyName}
Industry: ${body.industry}
Product Value Bullets:
${body.productBullets}
${body.yourName ? `Sender: ${body.yourName}` : ''}

Return a JSON object with exactly these five fields:
- "subjectLine": A compelling, specific subject line (max 8 words)
- "openingHook": A 1-2 sentence personalized opening referencing the company/industry
- "valueProposition": 2-3 sentences on what problem you solve for them specifically
- "socialProof": 1 sentence social proof or credibility signal (use [Company X] placeholder if needed)
- "callToAction": A single, low-friction CTA sentence`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { companyName, industry, productBullets, yourName } = req.body ?? {};

  // Basic input validation
  if (!companyName || !industry || !productBullets) {
    return res.status(400).json({ error: 'Missing required fields: companyName, industry, productBullets' });
  }

  // Input caps — prevent abuse
  const safeBody = {
    companyName: String(companyName).slice(0, 100),
    industry: String(industry).slice(0, 100),
    productBullets: String(productBullets).slice(0, 600),
    yourName: yourName ? String(yourName).slice(0, 80) : undefined,
  };

  const prompt = buildUserPrompt(safeBody);

  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured on server.' });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(
      `${SYSTEM_PROMPT}\n\n${prompt}\n\nReturn ONLY valid JSON. No markdown, no code blocks.`
    );
    const rawContent = result.response.text()
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    if (!rawContent) return res.status(500).json({ error: 'Empty response from AI.' });

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return res.status(500).json({ error: 'AI returned unexpected format. Please try again.' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('429')) return res.status(429).json({ error: 'Rate limit reached. Please wait and try again.' });
    if (msg.includes('401') || msg.includes('Incorrect API key')) return res.status(401).json({ error: 'Invalid API key.' });
    return res.status(500).json({ error: 'Failed to reach AI service. Please try again.' });
  }
}
