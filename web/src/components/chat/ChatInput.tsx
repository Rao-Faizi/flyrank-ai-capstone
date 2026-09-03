import React, { useRef, useEffect } from 'react';
import { Send, Square, Loader2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
  reload: () => void;
  isStreaming: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  isStreaming,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        if (typeof form.requestSubmit === 'function') {
          form.requestSubmit();
        } else {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-lg p-2 flex items-end gap-2 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
      <textarea
        ref={textareaRef}
        value={input || ''}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={isLoading && !isStreaming} // Disable input only when fetching first token, not while streaming partials
        className="w-full bg-transparent text-slate-200 placeholder:text-slate-500 resize-none outline-none py-2 px-3 text-sm max-h-[150px] overflow-y-auto disabled:opacity-50"
        rows={1}
      />
      <div className="flex gap-1 shrink-0 pb-1 pr-1">
        {isLoading && !isStreaming ? (
          <button
            type="button"
            className="p-2 bg-slate-800 text-slate-400 rounded-lg cursor-not-allowed"
            disabled
          >
            <Loader2 size={18} className="animate-spin" />
          </button>
        ) : isStreaming ? (
          <button
            type="button"
            onClick={stop}
            className="p-2 bg-rose-900/50 hover:bg-rose-900 text-rose-400 rounded-lg transition"
            aria-label="Stop generating"
          >
            <Square size={18} fill="currentColor" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input || !input.trim()}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        )}
      </div>
    </form>
  );
};
