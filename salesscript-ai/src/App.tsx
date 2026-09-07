import { useGenerateScript } from './hooks/useGenerateScript';
import { ScriptForm } from './components/ScriptForm';
import { ScriptResult } from './components/ScriptResult';
import { ErrorBanner } from './components/ErrorBanner';
import { LoadingSkeleton } from './components/LoadingSkeleton';

function App() {
  const { status, script, error, generate, reset } = useGenerateScript();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Decorative background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 -z-10" aria-hidden="true" />

      <main className="relative mx-auto max-w-xl px-4 py-12 sm:py-20">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/60 bg-emerald-950/40 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-4 uppercase tracking-wider">
            <span aria-hidden="true">⚡</span> AI-Powered
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            SalesScript <span className="text-emerald-400">AI</span>
          </h1>
          <p className="mt-3 text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
            Paste your prospect's details. Get a complete, structured cold outreach email — instantly.
          </p>
        </header>

        {/* Main card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 shadow-2xl">
          {status === 'idle' && (
            <ScriptForm onSubmit={generate} isLoading={false} />
          )}
          {status === 'loading' && (
            <LoadingSkeleton />
          )}
          {status === 'error' && error && (
            <ErrorBanner message={error} onRetry={reset} />
          )}
          {status === 'success' && script && (
            <ScriptResult script={script} onReset={reset} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-600">
          Powered by Google Gemini · Part of the{' '}
          <a
            href="https://flyrank-ai-capstone.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-emerald-400 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
          >
            FlyRank AI Capstone
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
