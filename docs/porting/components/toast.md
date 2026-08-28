# Toast port evidence

## Source boundary

This port uses only the MIT-designated COSS files under `reference/apps/ui/**`.
The implementation source is `registry/default/ui/toast.tsx`. The related registry metadata in
`registry/registry-ui.ts` supplies the four upsert keyframes and their durations.

The documentation source is `content/docs/components/toast.mdx`. I read every particle that imports
the component:

- `p-button-40.tsx`
- `p-toggle-8.tsx`
- `p-toast-1.tsx` through `p-toast-13.tsx`

No file under `reference/packages/ui/**` was used.

## COSS contract

The public surface has two detached managers, `toastManager` and `anchoredToastManager`; a standard
provider with six viewport positions; an anchored provider; and the underlying primitive namespace.
The standard provider defaults to `bottom-right`. Its viewport is fixed, 360px at most, 32px from
the desktop edges and 16px from narrow-screen edges. Toasts are absolutely stacked with a 12px peek,
10% scale steps, height-aware expansion, and directional swipe exits.

The standard content is a compact row with 14px horizontal and 12px vertical padding. Status icons
use the COSS semantic colors. Loading uses the spinning Loader Circle. Actions use the `xs` button
variant. Promise toasts reuse one toast identity while moving through loading and success or error.
Stable IDs replay a 320ms success scale animation or a 280ms error shake, alternating keyframe names
so repeated updates restart reliably.

Anchored toasts use a floating positioner with a 4px default side offset and a 256px maximum width.
Tooltip-style anchored toasts use 8px by 4px padding, a medium radius, and 12px text. Other anchored
toasts share the standard content treatment. Anchored toasts do not swipe.

The documentation examples cover default, status, loading, action, promise, varying-height,
anchored, progress/cancel, upsert, and anchored-tooltip states. The two cross-component particles add
an information/cancellation flow and a bookmark tooltip.

## Shards basis

I read the complete local Shards Toast implementation under
`shardsui/packages/shardsui/src/lib/components/toast/**`, its Toast documentation, all eight demos,
all Toast tests, and all 48 test fixtures. I also compared the installed `0.1.0-beta.0` output with
the local source. The only relevant source differences are TypeScript narrowing casts; the public
and runtime contracts match.

Shards supplies the provider-scoped queue, detached manager, timer pause and resume behavior,
promise updates, limits, portal, height measurements, live regions, F6 focus entry, Tab navigation,
Escape dismissal, focus restoration, floating positioning, and pointer swipe mechanics. The COSS
layer supplies presentation, position-to-swipe mapping, semantic icons, global managers, and upsert
replay styling. No second motion library is needed.

## Upstream runtime evidence

The upstream Next app ran locally at `/ui/docs/components/toast`. Automated Playwright inspection
recorded:

- desktop viewport: 360px wide, 32px from the right and bottom; narrow viewport: 358px wide in a
  390px viewport, with 16px side and bottom insets
- default toast: 360 by 68px, 10px radius, one-pixel border, `role="dialog"`, and generated
  `aria-labelledby` and `aria-describedby` relationships
- notification viewport: `role="region"`, `aria-live="polite"`, `aria-atomic="false"`,
  `aria-relevant="additions text"`, and label `Notifications`
- collapsed stack transforms at indexes 0, 1, and 2: scale 1, 0.9, and 0.8 with 12px peeks;
  hovering marks the stack expanded and restores hidden content
- F6 focuses the notification region; Tab enters the newest toast before its action
- action toast: success state with an `xs` Undo button; activating it closes the original and adds
  the information toast `Action undone`
- promise toast: `loading` with Loader Circle, then the same root updates to `success` with Circle
  Check and the resolved description
- anchored tooltip: top-centered, 4px from its anchor, about 61 by 26px for `Copied!`, 8px radius,
  12px text, and 256px positioner maximum width
- a rightward pointer gesture exposes swipe state and movement variables, then closes with
  `data-swipe-direction="right"`

Light, dark-class, narrow, keyboard, focus, live-region, motion, stack, promise, action, anchored,
and swipe states were included in the automated run. The Codex in-app Browser runtime reported no
attached browser backend during this lane. I did not use Chrome. A final manual visual comparison
therefore remains a review-time check when the in-app Browser is available.

## Test plan

Behavior tests cover provider and portal lifecycle, standard and anchored DOM, live regions, labels,
status icons, action and cancel handlers, promise loading/success/error, timer pause and resume,
stack limits and expansion, dismiss-all, F6/Tab/Escape focus behavior, the exact six
position-to-swipe mappings, SSR output, hydration without warnings, cleanup, dark classes, and
narrow viewport hooks. Type tests cover manager data, promise callbacks, provider options, portal
targets, root props, action native attributes, and every public alias.

## Hugeicons authority update

Toast status glyphs now map error, info, loading, success, and warning to `AlertCircleIcon`, `InformationCircleIcon`, `Loading03Icon`, `CheckmarkCircle02Icon`, and `Alert02Icon` through `HugeiconsIcon`. The icon remains decorative; type-driven color, loading opacity, and spin classes stay unchanged. Promise transitions and mounted path rendering are covered in the browser suite, while the scoped source audit rejects copied paths and Lucide markers.
