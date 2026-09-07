import { useState, useCallback } from 'react';
import { generateScript } from '../lib/generateScript';
import type { ScriptInput, SalesScript, GenerateStatus } from '../types/script';

/**
 * Custom hook that encapsulates all state for generating a sales script.
 * Keeps the component clean — it only needs to call `generate(input)`.
 */
export function useGenerateScript() {
  const [status, setStatus] = useState<GenerateStatus>('idle');
  const [script, setScript] = useState<SalesScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (input: ScriptInput) => {
    setStatus('loading');
    setScript(null);
    setError(null);

    try {
      const result = await generateScript(input);
      setScript(result);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setScript(null);
    setError(null);
  }, []);

  return { status, script, error, generate, reset };
}
