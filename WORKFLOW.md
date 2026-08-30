# Workflow Analysis: Vague vs. Precise Prompting

## Overview
This exercise compared two different prompting methodologies for building a User Settings form with validation. Round one utilized a single, context-free sentence. Round two utilized a structured prompt featuring constraints, required behaviors, and an explicit verification loop. 

## Diff Comparison & Correctness
The difference in the output was significant. The `round-one-vague` branch produced a functional but fragile form. It relied on default browser validation (like `<input type="email">`), which provides inconsistent UX across different browsers, and lacked proper error handling. 

The `round-two-precise` branch produced production-ready code. Because the prompt demanded an "explore-plan-code" loop, the AI proactively built inline error message containers and handled the DOM manipulation correctly. 

## Accessibility & Edge Cases
In round one, I caught a specific AI mistake: the model neglected to link the `<label>` elements to their respective `<input>` fields using `for` and `id` attributes, and completely omitted ARIA attributes. This made the form highly inaccessible for screen readers. 

In round two, the strict constraints forced the AI to include `aria-invalid="true"` dynamically during validation failures and properly bind all labels. The verification step in the prompt also caught an edge case before generating the code: the AI realized it needed to `trim()` the name input to prevent a user from submitting empty whitespace to bypass the "> 2 chars" rule. 

## Review Effort & Time
Counterintuitively, round two was faster end-to-end. While drafting the precise prompt took two extra minutes, it required zero manual fixing. Round one took ten seconds to prompt, but reviewing the code revealed missing labels, poor validation logic, and missing payload formatting. Fixing round one manually to match the quality of round two would have taken 10-15 minutes of human coding.