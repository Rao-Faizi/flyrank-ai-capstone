'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-slate-950 p-6 text-center text-slate-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 shadow-2xl"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">
            Something went wrong!
          </h2>
          <p className="text-sm text-slate-400">
            We encountered an unexpected error. Please try refreshing or resetting the application.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </motion.div>
    </div>
  );
}
