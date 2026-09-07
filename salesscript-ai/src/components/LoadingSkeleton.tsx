import React from 'react';

/**
 * Skeleton loading state displayed while the AI generates a script.
 * Uses aria-busy and a visually descriptive label for screen readers.
 */
export const LoadingSkeleton: React.FC = () => (
  <div aria-busy="true" aria-label="Generating your sales script, please wait…" className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 animate-pulse">
        <div className="h-3 w-24 bg-slate-700 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-700 rounded w-full" />
          <div className="h-3 bg-slate-700 rounded w-4/5" />
        </div>
      </div>
    ))}
    <p className="text-center text-xs text-slate-500 animate-pulse pt-1">
      AI is crafting your personalised script…
    </p>
  </div>
);
