import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from 'ai';
import { Bot, User, AlertTriangle, RotateCcw } from 'lucide-react';
import { ToolInvocationRenderer } from './ToolInvocationRenderer';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error?: Error | undefined;
  reload?: () => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading, error, reload }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!reload || isRetrying) return;
    setIsRetrying(true);
    try {
      await reload();
    } finally {
      setIsRetrying(false);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const showRetry = error && lastMessage && (lastMessage.role === 'user' || (lastMessage.role === 'assistant' && !lastMessage.content && (!lastMessage.toolInvocations || lastMessage.toolInvocations.length === 0)));

  return (
    <div className="flex flex-col space-y-6 pb-4">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-200'
                }`}
            >
              {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 ${message.role === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-sm'
                : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                }`}
            >
              {message.role === 'user' ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content || ((message as any).parts ? (message as any).parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') : '')}
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {(message.content || ((message as any).parts && (message as any).parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join(''))) && (
                    <div className="prose prose-invert prose-sm max-w-none text-slate-200">
                      <ReactMarkdown>
                        {message.content || ((message as any).parts ? (message as any).parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') : '')}
                      </ReactMarkdown>
                    </div>
                  )}
                  {message.toolInvocations?.map((toolInvocation: any) => (
                    <ToolInvocationRenderer key={toolInvocation.toolCallId} toolInvocation={toolInvocation} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 text-slate-200">
              <Bot size={16} />
            </div>
            {/* Real Skeleton Loader instead of bouncing dots */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-5 py-4 flex flex-col gap-2.5 w-64 animate-pulse">
              <div className="h-3 bg-slate-700/50 rounded-full w-3/4"></div>
              <div className="h-3 bg-slate-700/50 rounded-full w-full"></div>
              <div className="h-3 bg-slate-700/50 rounded-full w-5/6"></div>
            </div>
          </motion.div>
        )}

        {/* Mid-Stream Failure UI */}
        {showRetry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col pt-4 w-full"
          >
            <div className="flex flex-col gap-4 bg-rose-500/10 border border-rose-500/20 p-5 rounded-xl w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-medium text-base">
                  <AlertTriangle className="w-5 h-5" />
                  <span>
                    {error?.message?.includes('429') || error?.message?.includes('Rate limit') 
                      ? 'Rate Limit Exceeded (HTTP 429)' 
                      : 'Execution Failure & Interrupted Stream'}
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-rose-500 bg-rose-500/20 px-2 py-1 rounded">
                  HANDLED ERROR
                </span>
              </div>
              
              <div className="text-sm text-rose-400/80 font-mono bg-rose-950/30 p-3 rounded-lg overflow-x-auto">
                {error?.message || 'An unexpected connection error occurred.'}
              </div>

              <div className="flex items-center justify-between border-t border-rose-500/20 pt-4 mt-2">
                <div className="text-xs text-rose-400/60 italic truncate pr-4">
                  Will retry prompt: "{lastMessage?.content || 'Previous action'}"
                </div>
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex-shrink-0 flex items-center gap-2 text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RotateCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Retrying...' : 'Retry Failed Action'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
