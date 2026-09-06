import Link from 'next/link';
import { ClientViewer } from './ClientViewer';

export const metadata = {
  title: 'Interactive Property Viewer | FlyRank AI',
  description: 'Explore potential real estate investments in full 3D with interactive floor plans and lead compatibility scoring.',
};

export default function ThreeDViewerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Header specific to the 3D Viewer */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to AI Chat
          </Link>
          <div className="h-6 w-px bg-zinc-800" />
          <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            FlyRank Property Viewer
          </h1>
        </div>
        <div className="text-sm text-zinc-500 hidden sm:block">
          Interactive 3D Lead Qualification
        </div>
      </header>

      {/* Main 3D Viewport */}
      <main className="flex-1 relative">
        <ClientViewer />
      </main>
    </div>
  );
}
