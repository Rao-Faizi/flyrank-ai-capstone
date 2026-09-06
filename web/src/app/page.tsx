import { ChatInterface } from "@/components/chat/ChatInterface";
import { ShaderHero } from "@/components/hero/ShaderHero";

export default function Home() {
  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ShaderHero />
      <div className="flex flex-col gap-8 row-start-2 items-center w-full z-10 relative">
        <h1 className="text-3xl font-bold text-emerald-400">Central Qualification AI</h1>
        <p className="text-slate-400 text-sm max-w-xl text-center mb-8">
          This streaming chat interface uses the Vercel AI SDK to communicate with Gemini.
          It demonstrates a robust auto-scroll system, markdown streaming handling, and graceful "thinking" handoffs.
        </p>

        <a 
          href="https://property-viewer-three.vercel.app/" 
          target="_blank"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.29 7 12 12 20.71 7"/>
            <line x1="12" y1="22" x2="12" y2="12"/>
          </svg>
          Open 3D Property Viewer
        </a>

        {/* Mount our new component */}
        <div className="w-full max-w-2xl h-[600px]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
