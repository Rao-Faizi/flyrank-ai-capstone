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

    const { z } = await import('zod');
    const { tool } = await import('ai');

    const result = streamText({
      model: aiConfig.model,
      system: aiConfig.system,
      messages: validMessages,
      temperature: aiConfig.temperature,
      tools: {
        scoreLead: tool({
          description: 'Scores a lead based on company profile parameters.',
          parameters: z.object({
            companyName: z.string().describe('The name of the company.'),
            industry: z.string().describe('The industry the company operates in.'),
            employeeCount: z.number().describe('The number of employees at the company.'),
            estimatedBudget: z.number().optional().describe('The estimated budget of the company in USD, if known.'),
          }),
          execute: async ({ companyName, industry, employeeCount, estimatedBudget }: { companyName: string, industry: string, employeeCount: number, estimatedBudget?: number }) => {
            // Mock scoring algorithm
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
            
            let score = 50;
            if (employeeCount > 1000) score += 20;
            if (employeeCount < 50) score -= 10;
            if (estimatedBudget && estimatedBudget > 50000) score += 15;
            if (industry.toLowerCase().includes('tech') || industry.toLowerCase().includes('software')) score += 10;

            const tier = score >= 80 ? 'Tier 1 - Strategic' : score >= 60 ? 'Tier 2 - Priority' : 'Tier 3 - Standard';
            const recommendation = score >= 80 
              ? 'Assign to Enterprise AE immediately. High likelihood of closing.'
              : score >= 60 
              ? 'Assign to Mid-Market SDR for further qualification.'
              : 'Nurture via automated email sequences.';

            return {
              companyName,
              score: Math.min(100, Math.max(0, score)),
              tier,
              recommendation
            };
          }
        })
      }
    });

    // Log the available methods on the result object to see what stream responses it supports
    console.log('Available result keys:', Object.keys(result));
    
    // Return standard stream response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Chat Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
