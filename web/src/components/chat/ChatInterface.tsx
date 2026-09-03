'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChevronDown, RefreshCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const ChatInterface: React.FC = () => {
  const { messages, status, stop, regenerate, setMessages, sendMessage, error, append } = useChat({
    id: 'capstone-qualification-chat',
  });

  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleEmptyStateClick = (prompt: string) => {
    append({ role: 'user', content: prompt });
  };

  const isLoading = status === 'streaming' || status === 'submitted';
  const reload = regenerate;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Load from localStorage on mount (Stretch goal)
  useEffect(() => {
    const saved = localStorage.getItem('chat-history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, [setMessages]);

  // Save to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Determine if we are actively streaming a response vs just waiting for the first token
  const lastMessage = messages[messages.length - 1];
  const isAssistantResponding = lastMessage?.role === 'assistant' && isLoading;

  // Auto-scroll logic
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsAtBottom(true);
    }
  }, []);

  useEffect(() => {
    if (isAtBottom && isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading, isAtBottom, scrollToBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    // Set a small threshold for being "at the bottom"
    setIsAtBottom(distanceToBottom < 15);
  };

  return (
    <div className="flex flex-col h-[100dvh] sm:h-full sm:max-h-[85dvh] min-h-[500px] w-full max-w-3xl mx-auto bg-slate-950 sm:border border-slate-800 sm:rounded-2xl overflow-hidden sm:shadow-2xl relative">
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center z-20 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-emerald-400">AI Qualification Assistant</h2>
          <div className="flex gap-3 text-xs text-slate-400">
            <span>Powered by Gemini 1.5 Flash</span>
            <a href="/demo" className="text-emerald-500 hover:underline">View Button Demo →</a>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Clear conversation history?')) {
              setMessages([]);
              localStorage.removeItem('chat-history');
            }
          }}
          className="text-slate-400 hover:text-slate-200 transition text-xs flex items-center gap-1 bg-slate-800 px-2 py-1 rounded"
        >
          <RefreshCcw size={12} /> Clear
        </button>
      </div>

      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
            <h3 className="text-xl font-medium text-slate-200 mb-3">No conversations yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              I can help qualify leads and summarize requirements. Try asking me about one below:
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => handleEmptyStateClick("Score a lead for Acme Corp, a tech company with 500 employees and a $100k budget")}
                className="text-xs text-left p-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-emerald-500/50 transition-colors text-slate-300"
              >
                "Score a lead for Acme Corp, a tech company with 500 employees and a $100k budget"
              </button>
              <button 
                onClick={() => handleEmptyStateClick("Can you score an SMB retail company with 15 employees?")}
                className="text-xs text-left p-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-emerald-500/50 transition-colors text-slate-300"
              >
                "Can you score an SMB retail company with 15 employees?"
              </button>
            </div>
          </div>
        ) : (
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading && !isAssistantResponding} 
            error={error}
            reload={reload}
          />
        )}
      </div>

      {/* Floating Jump to Bottom Button */}
      <AnimatePresence>
        {!isAtBottom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10"
          >
            <button
              onClick={scrollToBottom}
              className="bg-slate-800/90 backdrop-blur border border-slate-700 text-slate-200 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg hover:bg-slate-700 transition flex items-center gap-1"
            >
              <ChevronDown size={14} /> Jump to latest
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md z-20 shrink-0 pb-safe">
        <ChatInput 
          input={input} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmit} 
          isLoading={isLoading} 
          stop={stop} 
          reload={reload} 
          isStreaming={isAssistantResponding}
        />
      </div>
    </div>
  );
};
