'use client';

import React, { useState } from 'react';
import { AnimatedSendButton, ButtonState } from '@/components/ui/AnimatedSendButton';

export default function DemoPage() {
  const [status, setStatus] = useState<ButtonState>('idle');
  const [inputValue, setInputValue] = useState('');

  // Fake async call with a random delay and a controllable failure rate
  const simulateSend = async (forceError: boolean = false) => {
    if (status === 'loading') return;
    setStatus('loading');

    // Random delay between 800ms and 2000ms
    const delay = Math.floor(Math.random() * 1200) + 800;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Determine failure based on 20% random chance, or forced trigger
    const isError = forceError || Math.random() < 0.2;

    if (isError) {
      setStatus('error');
      // Reset back to idle after a few seconds so user can retry
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('success');
      // Reset back to idle after a few seconds
      setTimeout(() => {
        setStatus('idle');
        setInputValue('');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-emerald-400">Motion System Demo</h1>
          <p className="text-slate-400">
            A state-machine driven AnimatedSendButton demonstrating interruptible, compositor-friendly motion.
          </p>
        </header>

        {/* Demo Area */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-8">
          
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="demo-input" className="block text-sm font-medium text-slate-400">
                Type a message
              </label>
              <input
                id="demo-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message Acme Corp..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) {
                    simulateSend();
                  }
                }}
              />
            </div>
            
            {/* The Animated Component under test */}
            <AnimatedSendButton 
              status={status} 
              disabled={!inputValue.trim()} 
              onClick={() => simulateSend()} 
            />
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Manual Triggers
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setStatus('idle')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors"
              >
                Reset to Idle
              </button>
              <button
                onClick={() => simulateSend(false)}
                className="px-4 py-2 bg-emerald-900/50 hover:bg-emerald-800/50 text-emerald-400 rounded text-sm transition-colors"
              >
                Trigger Success Path
              </button>
              <button
                onClick={() => simulateSend(true)}
                className="px-4 py-2 bg-rose-900/50 hover:bg-rose-800/50 text-rose-400 rounded text-sm transition-colors"
              >
                Trigger Error Path
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
