# FlyRank AI Capstone Project

## Overview
A modular AI-assisted application focusing on context engineering, tool use, and reliable agentic workflows.

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