import React, { useState, useRef, type KeyboardEvent } from "react";

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    setActiveTab(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="w-full my-4">
      <div
        role="tablist"
        aria-label="Playground Features"
        className="flex border-b border-slate-700 gap-2"
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[idx] = el; }}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === idx}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === idx ? 0 : -1}
            onClick={() => setActiveTab(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              activeTab === idx
                ? "border-emerald-400 text-emerald-400 bg-slate-800/50 rounded-t"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, idx) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== idx}
          tabIndex={0}
          className={`p-4 bg-slate-900 border border-t-0 border-slate-700 rounded-b focus:outline-none ${
            activeTab === idx ? "block" : "hidden"
          }`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};
