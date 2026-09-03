import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeadScoreCard } from './LeadScoreCard';
import { AlertCircle, Terminal, Loader2, CheckCircle2 } from 'lucide-react';

interface ToolInvocationRendererProps {
  toolInvocation: any;
}

export const ToolInvocationRenderer: React.FC<ToolInvocationRendererProps> = ({ toolInvocation }) => {
  const { toolName, state, args, result } = toolInvocation;

  // We only support the scoreLead tool for now
  if (toolName !== 'scoreLead') return null;

  return (
    <div className="w-full my-2">
      <AnimatePresence mode="wait">
        {/* State 1: Input Streaming (Partial arguments) */}
        {state === 'call' && !args && (
          <motion.div
            key="streaming"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 text-slate-300 text-sm"
          >
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Analyzing lead profile...</span>
          </motion.div>
        )}

        {/* State 2: Input Available (Calling with args) */}
        {state === 'call' && args && (
          <motion.div
            key="input-available"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-2 p-4 bg-slate-800/60 rounded-lg border border-slate-700 text-sm"
          >
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Scoring Lead: {args.companyName || 'Processing...'}</span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1 opacity-70">
              evaluating {args.employeeCount ? `${args.employeeCount} employees` : 'company size'} • {args.industry || 'industry'}
            </div>
            <div className="flex gap-1 mt-2">
              <motion.div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} />
              <motion.div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
              <motion.div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
            </div>
          </motion.div>
        )}

        {/* State 3: Output Available (Success) */}
        {state === 'result' && result && !result.error && (
          <motion.div
            key="output-available"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <LeadScoreCard result={result} />
          </motion.div>
        )}

        {/* State 4: Output Error (Failure) */}
        {state === 'result' && (!result || result.error) && (
          <motion.div
            key="output-error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 p-4 bg-rose-500/10 rounded-lg border border-rose-500/30 text-sm"
          >
            <div className="flex items-center gap-2 text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>Lead Scoring Failed</span>
            </div>
            <p className="text-rose-400/80 text-xs">
              Unable to analyze company parameters. Please provide missing details like employee count or industry.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
