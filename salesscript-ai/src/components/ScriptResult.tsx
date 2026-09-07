import React, { useState } from 'react';
import type { SalesScript } from '../types/script';

interface ScriptResultProps {
  script: SalesScript;
  onReset: () => void;
}

const fields: { key: keyof SalesScript; label: string; icon: string }[] = [
  { key: 'subjectLine', label: 'Subject Line', icon: '✉️' },
  { key: 'openingHook', label: 'Opening Hook', icon: '🎣' },
  { key: 'valueProposition', label: 'Value Proposition', icon: '💎' },
  { key: 'socialProof', label: 'Social Proof', icon: '⭐' },
  { key: 'callToAction', label: 'Call to Action', icon: '🎯' },
];

/**
 * Displays the structured sales script output.
 * Each field is its own card so the user can copy them individually.
 */
export const ScriptResult: React.FC<ScriptResultProps> = ({ script, onReset }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Clipboard API not available in some browsers
    }
  };

  return (
    <section aria-label="Generated sales script" className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-emerald-400">Your Sales Script</h2>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
        >
          ← Generate Another
        </button>
      </div>

      {fields.map(({ key, label, icon }) => (
        <div
          key={key}
          className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-4 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {icon} {label}
            </span>
            <button
              onClick={() => copyToClipboard(script[key], key)}
              aria-label={`Copy ${label} to clipboard`}
              className="
                text-xs text-slate-500 hover:text-emerald-400 transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1
              "
            >
              {copiedKey === key ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-slate-100 text-sm leading-relaxed">{script[key]}</p>
        </div>
      ))}
    </section>
  );
};
