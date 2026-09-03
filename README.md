# FlyRank AI Capstone Project

## Overview
FlyRank AI is an AI Qualification Assistant that dynamically scores incoming leads using server-side tools (Generative UI) and communicates state gracefully under adverse network conditions.

## Motion & Animation System (Assignment Notes)
Our `AnimatedSendButton` uses Framer Motion's physics-based layout transitions.
- **Easings & Durations:** Instead of static durations (e.g. `0.3s`), layout transitions use a **Spring physics model** (`stiffness: 400, damping: 30`). This makes the component feel snappy but controlled, naturally allowing interruptions (like spam-clicking or hovering mid-transition) without abrupt snaps or layout thrashing.
- **Error Shake State:** Uses a short `0.4s` explicit tween for the horizontal X-axis shake because spring physics aren't suitable for strict repeating keyframes. 
- **Accessibility:** `useReducedMotion` is honored by disabling the error shake and the scale pop-in of the text, falling back to a simple opacity fade. Feedback is never removed, only the movement is reduced.

## Architecture & Conventions
This project is built using:
- **Runtime**: Node.js (LTS) with TypeScript for strict typing.
- **Design Pattern**: Modular AI Agent Pipelines & Tool Calling.
- **Coding Standards**: Emphasizes functional composition, strict types, and centralized error handling.
- **Version Control**: All commits strictly follow Conventional Commits 1.0.0 (`feat:`, `fix:`, `docs:`, `chore:`).

## Prerequisites
- Node.js (LTS version recommended)
- npm or yarn

## Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Build the project using `npm run build`.

## Development Roadmap
- [ ] Initialize core agent pipeline framework.
- [ ] Implement context engineering utilities.
- [ ] Integrate foundational tool definitions.
- [ ] Setup centralized error handling and logging.
- [ ] Add unit and integration tests.
- [ ] Finalize deployment configurations.

## Generative UI Tool Contracts

### `scoreLead`
Analyzes a lead based on company profile parameters and returns a structured score and recommendation.
- **Name:** `scoreLead`
- **Parameters Schema:**
  - `companyName` (string): The name of the company.
  - `industry` (string): The industry the company operates in.
  - `employeeCount` (number): The number of employees at the company.
  - `estimatedBudget` (number, optional): The estimated budget of the company in USD, if known.
- **Return Shape:**
  ```typescript
  {
    companyName: string;
    score: number;
    tier: string;
    recommendation: string;
  }
  ```