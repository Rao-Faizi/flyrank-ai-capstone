import { ChatInterface } from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full">
        <h1 className="text-3xl font-bold text-emerald-400">Central Qualification AI</h1>
        <p className="text-slate-400 text-sm max-w-xl text-center mb-8">
          This streaming chat interface uses the Vercel AI SDK to communicate with Gemini.
          It demonstrates a robust auto-scroll system, markdown streaming handling, and graceful "thinking" handoffs.
        </p>

        {/* Mount our new component */}
        <div className="w-full max-w-2xl h-[600px]">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
