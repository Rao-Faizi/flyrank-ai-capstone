import { useState } from "react";
import { Modal } from "./components/Modal";
import { Tabs } from "./components/Tabs";
import { Disclosure } from "./components/Disclosure";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabsData = [
    {
      id: "overview",
      label: "Overview",
      content: <p>W3C ARIA Authoring Practices test playground for accessible components.</p>,
    },
    {
      id: "specs",
      label: "Specifications",
      content: <p>Strict keyboard traps, arrow-key tab switching, and toggle regions.</p>,
    },
    {
      id: "review",
      label: "Review Notes",
      content: <p>Comparing hand-crafted primitives with Radix UI / shadcn architecture.</p>,
    },
  ];

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-8">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-emerald-400">ARIA Component Playground</h1>
        <p className="text-slate-400 text-sm mt-1">Built with React, TypeScript, and Zero Component Libraries.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">1. Modal Dialog</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          Open Accessible Modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Keyboard Focus Trap Test"
        >
          <p>
            Press <strong>Tab</strong> or <strong>Shift+Tab</strong> to observe the focus ring remaining inside this dialog.
            Press <strong>Escape</strong> to dismiss and return focus to the trigger button.
          </p>
        </Modal>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">2. Accessible Tabs</h2>
        <Tabs tabs={tabsData} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">3. Disclosure Component</h2>
        <Disclosure title="What makes this disclosure accessible?">
          It uses standard HTML buttons, ties aria-expanded dynamically to state, and binds aria-controls to a guaranteed unique content ID.
        </Disclosure>
        <Disclosure title="Can it be toggled with keyboard only?">
          Yes, native button elements trigger click handlers on both Space and Enter key events automatically.
        </Disclosure>
      </section>
    </main>
  );
}
