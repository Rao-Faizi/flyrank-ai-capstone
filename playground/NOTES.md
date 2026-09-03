# NOTES.md: Custom ARIA Components vs. shadcn/ui (Radix Primitives)

## Architectural Comparison & Gaps Identified

### 1. Portal Rendering and DOM Stacking Contexts
* **Hand-Crafted Version:** The custom `Modal` renders directly into the local React DOM hierarchy, relying strictly on Tailwind CSS `fixed z-50` positioning. If an ancestor container applies CSS `transform`, `filter`, or `perspective`, the modal's stacking context is constrained, leading to clipping and z-index collisions.
* **shadcn/ui (Radix UI Primitive):** Shadcn renders dialogs through `@radix-ui/react-portal`, hoisting the modal DOM node to `document.body`. This guarantees that dialogs are independent of parent CSS stacking contexts and prevents overflow/clipping bugs.

### 2. Scroll Locking and Outside Interaction Handling
* **Hand-Crafted Version:** When the custom modal opens, background body scrolling is not intercepted or locked. Users can scroll the document underneath the overlay, and outside clicks only use basic bubbling stops.
* **shadcn/ui (Radix UI Primitive):** Radix implements `react-remove-scroll` to lock body scroll without jumping scrollbar layout shifts. It also implements pointer-event interception (`DismissableLayer`), which differentiates between touch-drag dismissals, pointer cancels, and outside clicks.

### 3. Dynamic DOM Mutations in Focus Trapping
* **Hand-Crafted Version:** Focus trapping queries focusable elements once on modal mount (`querySelectorAll`). If focusable inputs are dynamically rendered inside the dialog after mounting (such as an asynchronous form), the trap misses them.
* **shadcn/ui (Radix UI Primitive):** Radix wraps focus trapping in `@radix-ui/react-focus-scope`, maintaining live element observers to dynamically recompute focus boundaries whenever the DOM structure inside changes.
