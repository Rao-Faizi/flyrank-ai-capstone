# SalesScript AI

> An AI-powered cold outreach email generator. Paste in a prospect's company details and get a complete, structured sales email — instantly.

## 🚀 Live App
**[https://salesscript-ai.vercel.app/](https://salesscript-ai.vercel.app/)**
*(Deploy the app to Vercel to get this URL — see Deployment below)*

---

## What It Does
SalesScript AI solves a real problem for B2B sales reps: writing personalized cold outreach is time-consuming and inconsistent across teams. You fill in three fields — company name, industry, and a few product value bullets — and the AI returns a structured email with **five distinct, individually copyable sections**:

- **Subject Line** — short, specific, compelling
- **Opening Hook** — personalized to the prospect's company/industry
- **Value Proposition** — tailored to their world
- **Social Proof** — credibility signal (templated placeholder)
- **Call to Action** — single, low-friction ask

This is not a chatbot. It is a structured generation tool that uses Gemini's JSON output mode validated by Zod, so the output is always type-safe and never half-rendered.

---

## ⚡ Getting Started (< 5 minutes)

### Prerequisites
- Node.js 18+ (LTS recommended)
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/))

### Setup
```bash
# 1. Clone the repo
git clone https://github.com/Rao-Faizi/flyrank-ai-capstone.git
cd flyrank-ai-capstone/salesscript-ai

# 2. Install dependencies
npm install

# 3. Create environment file
echo "VITE_GOOGLE_GENERATIVE_AI_API_KEY=your_key_here" > .env.local

# 4. Start the dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key for structured text generation | ✅ Yes |

Create a `.env.local` file in the `salesscript-ai/` directory with the above key. Never commit this file.

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── ScriptForm.tsx       # Controlled input form with full a11y labels
│   ├── ScriptResult.tsx     # Displays 5-field structured output with copy buttons
│   ├── ErrorBanner.tsx      # role="alert" error state with retry action
│   └── LoadingSkeleton.tsx  # aria-busy loading state
├── hooks/
│   └── useGenerateScript.ts # Manages async state (idle/loading/success/error)
├── lib/
│   └── generateScript.ts    # Core AI call: builds prompt, calls Gemini, Zod-validates output
├── types/
│   └── script.ts            # TypeScript types for ScriptInput and SalesScript
└── test/
    ├── ScriptForm.test.tsx
    ├── ScriptResult.test.tsx
    └── ErrorBanner.test.tsx
```

### Key Decisions
- **Vite + React** instead of Next.js — keeps this a standalone, independently deployable module within the monorepo (same pattern as the 3D viewer and shader hero).
- **Raw `@google/generative-ai`** instead of a framework wrapper — direct, minimal, zero extra abstraction.
- **Zod validation on AI output** — the response is parsed from JSON and validated against a strict schema before any component renders it. Malformed or partial AI output is caught and shown as a user-friendly error, never a blank screen.
- **Structured output prompt** — we instruct Gemini to return a specific JSON shape, not free-form text. This is the "AI meaningfully integrated" requirement: without the structure, the output wouldn't be individually copyable or type-safe.

---

## 🤖 AI Integration

**Model:** `gemini-2.0-flash` via `@google/generative-ai`

**Prompt strategy:** We build a structured prompt from the form inputs and explicitly instruct the model to return a JSON object with exactly five named fields. No markdown, no prose.

**Why structured output?** A plain chatbot would return a formatted email in one blob. Our approach returns five *separate, independently usable* fields — each one can be copied to a different CRM field. This is meaningfully better than a text box.

**Validation:** Every response goes through Zod's `safeParse` before being passed to React state. If Gemini returns malformed JSON or omits a field, the user sees a clean `ErrorBanner` with a "Try Again" button — not a crash.

---

## 🧪 Testing

Run tests:
```bash
npm test
```

**11 tests across 3 files, all passing:**

| File | Tests |
|---|---|
| `ScriptForm.test.tsx` | Renders labels, disables submit when empty, enables on fill, calls onSubmit correctly, shows loading state |
| `ScriptResult.test.tsx` | Renders all 5 fields, renders reset button, renders 5 copy buttons |
| `ErrorBanner.test.tsx` | Renders message, has `role="alert"`, renders retry button |

---

## ♿ Accessibility & Performance

- **Lighthouse Mobile:** Performance 90+, Accessibility 100, Best Practices 100, SEO 100
- **WCAG AA:** All form inputs have explicitly associated `<label>` elements. Error states use `role="alert"` for screen reader announcements. Loading state uses `aria-busy`. All interactive elements have visible `focus-visible` rings.
- **Performance:** The Gemini SDK is the only non-trivial dependency. No 3D libraries, no animation frameworks. Production bundle is ~277 KB / 84 KB gzipped.

---

## 🛡️ Error Handling

| Scenario | Behaviour |
|---|---|
| Missing API key | Throws immediately with a clear setup message |
| Network failure / 429 | `ErrorBanner` with "Try Again" |
| Malformed JSON from AI | Zod catches it, `ErrorBanner` shown |
| Empty required fields | Submit button disabled; form validation prevents call |

---

## 🚢 Deployment

### Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `flyrank-ai-capstone` from GitHub
3. Set **Root Directory** to `salesscript-ai`
4. Add environment variable: `VITE_GOOGLE_GENERATIVE_AI_API_KEY`
5. Click Deploy

### Deployment Checklist
- [x] `npm run build` passes locally
- [x] `npm test` — 11 tests pass
- [x] Env var set in Vercel dashboard
- [x] Lighthouse ≥85 verified
- [x] No WCAG AA violations
- [x] Error states tested manually
- [x] Rollback plan: Vercel dashboard → Deployments → Instant Rollback to any previous deployment

---

## 📋 Known Limitations & Future Work
- **No auth / rate limiting** — the API key is exposed as a Vite env var (prefixed `VITE_`), which means it's bundled into the client. For production hardening, move the Gemini call to a server-side function (Vercel Edge/Serverless) so the key is never sent to the browser.
- **No history** — generated scripts are not saved. Adding `localStorage` persistence would make the tool immediately more useful.
- **Single tool call** — the `scoreLead` generative UI tool from the main capstone could be combined here to auto-score the prospect before generating the script.

---

## 🤖 Honest AI Usage
This project was built with **Google Antigravity IDE (Gemini)** as a pair programmer throughout:
- Scaffolded the Vite + React + TS project structure
- Generated the GLSL simplex noise shader (in the sister `shader-hero` module)
- Debugged TypeScript type errors in Vitest configuration (the `tsconfig.app.json` + `vitest/globals` integration)
- Proposed the Zod-validated structured output pattern as a safer alternative to free-form AI text parsing
- Wrote the initial component skeleton for `ScriptForm`, `ScriptResult`, `ErrorBanner`, and `LoadingSkeleton`

---

## 🪞 Reflection
**What was hardest?** Keeping the AI integration genuinely useful rather than decorative. "Just a chatbot" would have been much easier. Designing the structured 5-field prompt and wiring Zod validation into the failure path took the most thought.

**What would I do differently?** Move the Gemini API call to a server-side function from day one to avoid the client-side API key exposure problem. Also add `localStorage` caching of the last generated script so a refresh doesn't erase your work.

**One surprising thing:** Vitest's integration with Vite is near-zero-config compared to setting up Jest, and it shares the same transform pipeline, meaning the tests run in exactly the same environment as the app. The `vitest/config` import swap over `vite`'s `defineConfig` was the only gotcha.
