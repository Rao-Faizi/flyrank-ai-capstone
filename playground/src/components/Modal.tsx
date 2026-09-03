import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }
        if (e.key === "Tab") {
          if (!dialogRef.current || !focusableElements || focusableElements.length === 0) return;
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-lg w-full shadow-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 p-1 rounded"
          >
            ✕
          </button>
        </div>
        <div className="py-4 text-slate-300 text-sm">{children}</div>
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
