import React from 'react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

/**
 * Renders a clear, accessible error state with a retry action.
 * Uses role="alert" so screen readers announce it immediately.
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => (
  <div
    role="alert"
    aria-live="assertive"
    className="rounded-xl border border-red-500/40 bg-red-950/40 p-5 text-center space-y-3"
  >
    <p className="text-2xl" aria-hidden="true">⚠️</p>
    <p className="text-sm font-medium text-red-300">{message}</p>
    <button
      onClick={onRetry}
      className="
        mt-1 rounded-lg px-5 py-2 text-sm font-semibold text-white
        bg-red-700 hover:bg-red-600 transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
      "
    >
      Try Again
    </button>
  </div>
);
