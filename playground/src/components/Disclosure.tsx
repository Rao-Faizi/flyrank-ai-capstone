import React, { useState, useId } from "react";

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export const Disclosure: React.FC<DisclosureProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentId = useId();
  const buttonId = useId();

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden my-2">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 flex justify-between items-center transition"
        >
          <span className="font-medium text-slate-200">{title}</span>
          <span className="text-sm text-slate-400">{isOpen ? "▲" : "▼"}</span>
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={`px-4 py-3 bg-slate-900 text-slate-300 ${!isOpen ? "hidden" : "block"}`}
      >
        {children}
      </div>
    </div>
  );
};
