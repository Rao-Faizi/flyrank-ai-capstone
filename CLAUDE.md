# Project Architecture & Coding Standards

## Tech Stack
- Runtime: Node.js (LTS) / TypeScript
- Architecture: Modular AI Agent Pipelines & Tool Calling
- Conventions: Strict types, functional composition, centralized error handling

## Git Standards
- All commits must strictly follow Conventional Commits 1.0.0 (`feat:`, `fix:`, `docs:`, `chore:`).

## UI & Form Guidelines
- All forms must use explicit `<label for="...">` bindings for every input; do not rely on implicit wrapping.
- Implement explicit client-side validation with inline error messages; never rely solely on default HTML5 browser validation.
- Sanitize inputs prior to validation checks (e.g., always apply `.trim()` to string payloads before length evaluation).