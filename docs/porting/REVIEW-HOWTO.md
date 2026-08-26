# Review procedure

## Runtime allocation

- React reference: port `4000`, shared read-only.
- Integrated Svelte preview: port `4173`.
- Isolated review lanes: assign deterministic ports beginning at `5101` and never share writable browser profiles.

## Required source inspection

For each component or documentation lane, freshly read the actual COSS registry file, component page, every related particle, and the matching Shards source, documentation, tests, examples, and types. The implementation report is an index, not evidence.

## Browser comparison

Use the in-app browser for the React and Svelte routes at identical viewport sizes.

Check:

- light and dark themes;
- desktop and narrow layouts;
- every applicable user-visible state;
- pointer and keyboard operation;
- focus entry, traversal, dismissal, and restoration;
- reduced-motion behavior;
- DOM semantics, accessible names, roles, properties, and relationships;
- axe output, console errors, and hydration warnings;
- exact text, data, icons, example order, and code source.

Use bounding boxes and computed CSS values when screenshots do not explain a difference.

## Finding format

Record:

- source and target route;
- source file and relevant lines;
- target file and relevant lines;
- state and viewport;
- expected and actual result;
- screenshot, measurement, DOM, or accessibility evidence;
- severity and required correction.

Approval names the exact commit SHA. A later fix requires focused re-review.

