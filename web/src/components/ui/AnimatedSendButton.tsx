'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Send, Check, X, Loader2 } from 'lucide-react';

export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

interface AnimatedSendButtonProps {
  status: ButtonState;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function AnimatedSendButton({
  status,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}: AnimatedSendButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDisabled = disabled || status === 'loading' || status === 'success';

  // State-based configurations
  const config = {
    idle: {
      bg: 'bg-emerald-600 hover:bg-emerald-500',
      text: 'text-white',
      width: 'w-12',
      label: null,
      icon: <Send className="w-5 h-5 ml-0.5" />,
    },
    loading: {
      bg: 'bg-slate-700',
      text: 'text-slate-300',
      width: 'w-32',
      label: 'Sending...',
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
    },
    success: {
      bg: 'bg-emerald-500',
      text: 'text-white',
      width: 'w-32',
      label: 'Sent',
      icon: <Check className="w-5 h-5" />,
    },
    error: {
      bg: 'bg-rose-500',
      text: 'text-white',
      width: 'w-32',
      label: 'Failed',
      icon: <X className="w-5 h-5" />,
    },
  };

  const currentConfig = config[status];

  // Motion variants for the shake effect on error
  const shakeVariants = {
    idle: { x: 0 },
    error: {
      x: prefersReducedMotion ? 0 : [-5, 5, -5, 5, 0],
      transition: { duration: 0.4 },
    },
  };

  // Content transition variants
  const contentVariants = {
    initial: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 },
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-live="polite"
      aria-busy={status === 'loading'}
      aria-disabled={isDisabled}
      layout // Framer Motion handles the width transition automatically
      variants={shakeVariants}
      animate={status === 'error' ? 'error' : 'idle'}
      // We use a spring transition for layout morphs so it's smooth and snappy, preventing abrupt snaps.
      // Damping prevents bounciness, stiffness controls speed.
      transition={{ layout: { type: 'spring', stiffness: 400, damping: 30 } }}
      className={`
        relative flex items-center justify-center h-12 rounded-full font-medium overflow-hidden
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        transition-colors duration-200
        ${currentConfig.bg} ${currentConfig.text} ${currentConfig.width}
        ${disabled && status === 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={status} // Key changes trigger unmount/mount animations
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="flex items-center gap-2"
        >
          {currentConfig.icon}
          {currentConfig.label && (
            <motion.span 
              layout 
              className="whitespace-nowrap"
            >
              {currentConfig.label}
            </motion.span>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
