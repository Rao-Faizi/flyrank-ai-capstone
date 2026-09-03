import { google } from '@ai-sdk/google';

// The system prompt defines the AI's persona, boundaries, and expected output format.
export const SYSTEM_PROMPT = `
You are a highly capable AI qualification assistant. 
Your primary goal is to converse with users to understand their needs, collect necessary details, and summarize them effectively.
Be concise, professional, and helpful.
Format your responses using Markdown for readability (e.g., bullet points, bold text).
`.trim();

// Centralized model configuration
export const aiConfig = {
  // Using gemini-3.1-flash for fast, capable responses
  model: google('gemini-3.1-flash'),
  system: SYSTEM_PROMPT,
  temperature: 0.7,
  maxTokens: 1024,
};
