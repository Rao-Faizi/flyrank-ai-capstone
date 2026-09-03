import { streamText } from 'ai';
import { aiConfig } from '@/lib/ai/config';

// Allow streaming responses up to 30 seconds (Vercel Edge/Hobby limits)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const aiExports = await import('ai');
    console.log('AI Response Exports:', Object.keys(aiExports).filter(k => k.toLowerCase().includes('response')));

    // Sanitize messages to remove any empty or failed ones (like the previous 404 result)
    const validMessages = messages.filter(
      (m: any) => m.role && (m.content || (m.parts && m.parts.length > 0))
    ).map((m: any) => {
      let content = m.content;
      if (!content && m.parts) {
        content = m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text || (p as any).text).join('');
      }
      return { role: m.role, content };
    }).filter((m: any) => m.content && m.content.trim() !== '');

    console.log('Valid Messages:', JSON.stringify(validMessages, null, 2));

    const result = streamText({
      model: aiConfig.model,
      system: aiConfig.system,
      messages: validMessages,
      temperature: aiConfig.temperature,
      maxTokens: aiConfig.maxTokens,
    });

    // Log the available methods on the result object to see what stream responses it supports
    console.log('Available result keys:', Object.keys(result));
    
    // Fallback to data stream for now
    return aiExports.createUIMessageStreamResponse(result);
  } catch (error) {
    console.error('API Chat Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
