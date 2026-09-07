# Final Capstone: Planning Walkthrough

## What the Rubric Actually Demands (Checklist)

Before picking an idea, let's understand the hard pass/fail requirements:

| Requirement | Notes |
|---|---|
| ✅ Live, functional deployment | Vercel is fine — we've done this before |
| ✅ AI integrated *meaningfully* | Not a chatbot echo. Must solve a real problem |
| ✅ README: clone → run in < 5 min | One-command setup ideal |
| ✅ Tests: ≥50% component coverage | At least unit tests for one component |
| ✅ Lighthouse ≥85 (mobile), no WCAG AA violations | We know how to do this now |
| ✅ Deployment checklist + rollback plan | Documented, not just implied |
| ✅ Reflection (1 page max) | Honest, specific, not generic |
| ✅ Error states shown | Fallbacks, structured output, edge cases |

> [!IMPORTANT]
> The two things that cause a **Revise** most easily are: (1) AI that feels tacked on, and (2) missing or non-running tests. We need to plan the app *around* what we're testing, not add tests as an afterthought.

---

## Proposed App: **SalesScript AI**

### Problem Statement (1 paragraph)
Sales reps spend significant time manually tailoring cold outreach scripts for different prospects. They know their product, but writing compelling, personalized messaging for each new industry vertical or company size is time-consuming and inconsistent. **SalesScript AI** solves this: paste in a company name, industry, and a few bullet points about your product, and the AI generates a structured, ready-to-send cold outreach email — with a subject line, opening hook, value proposition, social proof placeholder, and a clear CTA. Not a chatbot. A structured output generation tool.

### Why This App?
- **Fits the existing FlyRank AI / B2B sales theme** of your capstone perfectly
- **AI is meaningful, not a gimmick** — the structured output (subject, hook, body, CTA as separate fields) is genuinely useful and demonstrates LLM tool use / structured generation
- **Small and completable in a week** — no auth, no database, no complex state
- **Highly testable** — each UI component (Input Form, Result Card, Error State) is isolated and easy to unit test

---

## Architecture Overview

```
salesscript-ai/          ← New folder (Vite + React + TypeScript)
├── src/
│   ├── components/
│   │   ├── ScriptForm.tsx      ← The main input form (company, industry, bullets)
│   │   ├── ScriptResult.tsx    ← Displays the structured AI output
│   │   ├── ErrorBanner.tsx     ← Handles error states gracefully
│   │   └── LoadingSkeleton.tsx ← Accessible loading state
│   ├── hooks/
│   │   └── useGenerateScript.ts ← Custom hook: calls API, manages state
│   ├── lib/
│   │   └── generateScript.ts   ← Core AI call: structured prompt + response parsing
│   ├── types/
│   │   └── script.ts           ← TypeScript types for the structured output
│   └── App.tsx
├── tests/
│   ├── ScriptForm.test.tsx     ← Unit tests (≥50% coverage)
│   └── generateScript.test.ts  ← Tests for error handling / parsing
└── README.md
```

### Tech Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | **Vite + React + TypeScript** | Standalone folder just like 3D viewer and shader hero |
| AI | **Google Gemini API** (you already have the key!) | Free, no new account needed. We can use Vercel AI SDK or direct fetch |
| Styling | **Tailwind CSS** | Fast, accessible, no stylesheet bloat |
| Testing | **Vitest + React Testing Library** | Native Vite integration, zero config |
| Deployment | **Vercel** | New standalone project, new URL |

### AI Integration: How It Works
The AI call uses a **structured output prompt** pattern — we don't just ask for "write me an email." We ask Gemini to respond in a **strict JSON schema**:
```json
{
  "subjectLine": "string",
  "openingHook": "string",
  "valueProposition": "string",
  "socialProof": "string",
  "callToAction": "string"
}
```
We then parse and validate this output with **Zod** schema validation before displaying it. If the JSON is malformed or the AI fails, we show a clean error state — never an empty screen or raw crash.

### Error Handling (Resilience)
- **API failure**: `ErrorBanner` component displayed with a "Try Again" button
- **Malformed AI output**: Zod validation catches it; shows partial results where possible
- **Empty input**: Form validation before any API call is made
- **Rate limit / 429**: Specific user-friendly error message

---

## Testing Plan (≥50% coverage)
| Test | File | What it tests |
|---|---|---|
| ScriptForm renders | `ScriptForm.test.tsx` | Form fields present, accessible labels |
| ScriptForm validation | `ScriptForm.test.tsx` | Prevents submit with empty fields |
| ScriptResult renders | `ScriptResult.test.tsx` | Displays all 5 structured fields |
| ErrorBanner renders | `ErrorBanner.test.tsx` | Error message + retry button present |
| generateScript parses | `generateScript.test.ts` | Valid JSON → structured output |
| generateScript handles error | `generateScript.test.ts` | API error → throws correctly |

This gives us 6 tests across ~4 components, comfortably clearing the 50% threshold.

---

## Deployment & Operation Plan
- **Platform:** Vercel (new project, new URL, `salesscript-ai` folder as root)
- **Env Var:** `VITE_GOOGLE_GENERATIVE_AI_API_KEY`
- **Rollback plan:** Vercel's built-in "Instant Rollback" from the dashboard to any previous deployment
- **Error monitoring:** Vercel's built-in function logs (no extra setup needed for an intern project)
- **Deployment Checklist:**
  - [ ] Env vars set in Vercel dashboard
  - [ ] Build passes locally (`npm run build`)
  - [ ] Lighthouse ≥85 verified
  - [ ] WAVE/axe shows no WCAG AA violations
  - [ ] AI route returns error state gracefully
  - [ ] All tests pass (`npm run test`)

---

## Open Questions for You

> [!IMPORTANT]
> **App Idea:** Do you like the "SalesScript AI" concept, or do you have a different problem you'd rather solve? The rubric says "solve something real" — it doesn't have to be B2B sales. What domain interests you most?

> [!NOTE]
> **AI Provider:** I've proposed using your existing **Google Gemini API key** to keep setup simple. The brief mentions Claude API, but says "or another LLM you prefer." Do you want to use Gemini (no new account needed) or set up a free Claude account?

> [!NOTE]
> **Vite vs Next.js:** I've proposed Vite (standalone, like the 3D viewer) to keep this as an independent folder. Do you agree with that approach, or do you prefer Next.js?

Once you approve the concept and answer these questions, I'll start building!
