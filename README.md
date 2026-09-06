# FlyRank AI Capstone Project

![FlyRank AI Hero](https://shader-hero-xi.vercel.app/)

A comprehensive AI Qualification Assistant and interactive digital experience. FlyRank AI dynamically scores incoming leads using server-side tools (Generative UI), visualizes properties in immersive 3D, and wraps the entire experience in a raw WebGL shader hero.

## 🚀 Live Production Links
- **Main App (AI Chat & Core):** [https://flyrank-ai-capstone.vercel.app/](https://flyrank-ai-capstone.vercel.app/)
- **Interactive 3D Property Viewer:** [https://property-viewer-three.vercel.app/](https://property-viewer-three.vercel.app/)
- **Interactive Shader Hero:** [https://shader-hero-xi.vercel.app/](https://shader-hero-xi.vercel.app/)

## ✨ What It Does
FlyRank AI is split into three core interactive experiences:
1. **The AI Qualification Agent:** A streaming chat interface powered by the Vercel AI SDK and Google Gemini. It automatically processes lead data, triggers a server-side `scoreLead` tool, and calculates a Lead Tier and Recommendation dynamically.
2. **The 3D Real Estate Viewer:** A procedural, interactive skyscraper built with Three.js & React Three Fiber. Users can click on floors to trigger a "Floor Exploder" animation, isolating properties and viewing their metrics in a 3D HUD.
3. **The Shader Hero:** A raw, fullscreen WebGL fragment shader featuring a fluid, interactive digital aurora that bends toward the user's cursor.

## 🛠️ Architecture & Decisions
- **Next.js App Router:** Powers the core infrastructure, Server Components, and the `api/chat` endpoints.
- **Production Hygiene & Abuse Prevention:** The `api/chat` route is protected by strict **Input Caps**. Conversation histories are aggressively truncated to the last 10 messages, and individual incoming messages are sliced to a maximum of 500 characters to prevent malicious actors from draining AI API credits. The route also enforces a `maxDuration = 30` to prevent serverless function timeouts.
- **Split-Bundle Architecture:** To maintain a 90+ Lighthouse Mobile Performance Score, the heavy 3D property viewer was extracted into a standalone deployment, keeping the main AI chat application lightweight and instantly interactive.
- **Raw WebGL Integration:** The Shader Hero was built without massive 3D libraries (like Three.js) to keep the bundle size practically at zero bytes, protecting the performance budget.

## ⚙️ Run Instructions (Local Development)

### Prerequisites
- Node.js (LTS version recommended)
- `npm`, `yarn`, `pnpm`, or `bun`

### Setup
1. Clone the repository.
2. Navigate to the core web app: `cd web`
3. Install dependencies: `npm install`
4. Set up your environment variables (see below).
5. Start the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables
To run the AI Chat interface locally, you must provide the following environment variable in a `.env.local` file at the root of the `web` directory:

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Google Gemini API Key used by the Vercel AI SDK to stream text and execute server-side tools. | Yes |

## 🤖 Honest AI Usage: How AI Tools Built This
This capstone was built through extensive pair-programming with the **Google Antigravity IDE (Gemini)**. 
- **Scaffolding & Architecture:** The AI was used to architect the split-bundle strategy to isolate the Three.js payload from the main Next.js application, preserving our 93+ Lighthouse performance score.
- **Accessibility (A11y) Audits:** The AI assistant analyzed the DOM and proposed semantic HTML fixes, added `aria-live="polite"` tags to the streaming AI chat for screen reader compatibility, and implemented visible focus rings for keyboard navigation.
- **Generative Code:** The raw WebGL GLSL fragment shader, including the Simplex noise algorithms and mouse-interaction flow fields, was heavily generated and mathematically tuned by the AI.
- **Debugging:** The AI successfully debugged complex React Server Component constraints, specifically resolving errors related to `next/dynamic` imports of `ssr: false` client components.