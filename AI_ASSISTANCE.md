# Assignment 3: AI Development Assistant Log

## 1. Prompts Used During Development
**Prompt 1 (Initial Scaffold):**
> "Build a React application in `App.jsx` for a Real Estate Lead Manager. Users should be able to add a lead (Name, Contact, and Status: Hot/Warm/Cold), view the list of leads, and delete a lead. Provide the complete code for `App.jsx` and `App.css`."

## 2. Explanation of AI Assistance
I utilized the AI agent to scaffold the foundational boilerplate of the React application. The AI successfully generated the functional components, set up the initial `useState` hooks for managing the lead form data, and handled the submission logic. It also provided a clean CSS layout. This saved significant time on structural UI coding, allowing me to focus on business logic and data persistence.

## 3. Manual Improvements & Refactoring
After reviewing and testing the AI-generated code, I identified a critical missing feature: the data was ephemeral and did not persist between browser reloads. 

**Manual Correction:** 
I refactored the `App.jsx` component by manually importing the `useEffect` hook. I updated the initial `useState` declaration to lazily evaluate and parse existing leads from the browser's `localStorage`. I then wrote a `useEffect` block to serialize and save the leads array to `localStorage` whenever the state mutated. This corrected the AI's oversight and made the application robust.
