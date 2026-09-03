import React from 'react';
import { ShieldCheck, ShieldAlert, Shield, Briefcase, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadScoreCardProps {
  result: {
    companyName: string;
    score: number;
    tier: string;
    recommendation: string;
  };
}

export const LeadScoreCard: React.FC<LeadScoreCardProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score >= 60) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
    if (score >= 60) return <Shield className="w-6 h-6 text-amber-400" />;
    return <ShieldAlert className="w-6 h-6 text-rose-400" />;
  };

  const colorClass = getScoreColor(result.score);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg my-2"
    >
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">{result.companyName || 'Unknown Company'}</h3>
          <p className="text-xs text-slate-400">AI Lead Analysis</p>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${colorClass}`}>
          <span className="text-lg font-bold">{result.score}</span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getScoreIcon(result.score)}</div>
          <div>
            <div className="text-sm font-medium text-slate-200">{result.tier}</div>
            <div className="text-xs text-slate-400 mt-1 leading-relaxed">
              {result.recommendation}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
