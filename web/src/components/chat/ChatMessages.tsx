import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from 'ai';
import { Bot, User } from 'lucide-react';
import { ToolInvocationRenderer } from './ToolInvocationRenderer';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
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
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-5 py-3 flex items-center gap-1">
              <motion.div
                className="w-2 h-2 bg-slate-400 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-slate-400 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-slate-400 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
