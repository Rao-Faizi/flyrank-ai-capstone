// All TypeScript types for the structured AI output and form input
export type AIProvider = 'openai' | 'gemini';

export interface ScriptInput {
  companyName: string;
  industry: string;
  productBullets: string;
  yourName?: string;
  provider: AIProvider;
}

export interface SalesScript {
  subjectLine: string;
  openingHook: string;
  valueProposition: string;
  socialProof: string;
  callToAction: string;
}

export type GenerateStatus = 'idle' | 'loading' | 'success' | 'error';
