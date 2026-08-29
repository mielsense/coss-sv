# Slider port evidence

## Source boundary

The port uses only the MIT-designated COSS files under `reference/apps/ui/**`. No
source from `reference/packages/ui/**` was used.

## COSS files inspected

- `reference/apps/ui/registry/default/ui/slider.tsx`
- `reference/apps/ui/content/docs/components/slider.mdx`
- `reference/apps/ui/registry/default/particles/p-slider-1.tsx` through
  `p-slider-23.tsx`
- `reference/apps/ui/registry/default/particles/p-field-16.tsx`, the remaining
  particle that imports the Slider component

The React component is a styled convenience wrapper around Base UI. It defaults
to a `0` to `100` range and edge-aligned thumbs, renders consumer children before
the slider control, and then always creates its control, track, indicator, and
one thumb for every current value. `SliderValue` is a separate styled primitive.

The exact COSS classes are preserved on the Svelte wrappers. This includes the
orientation sizing, disabled opacity, track pseudo-element, logical indicator
margin, desktop and small-screen thumb sizes, focus ring, and dragging scale.
COSS uses only CSS transitions for Slider, so this port does not add a motion
library.

## Shards files inspected

The complete local implementation under
`shardsui/packages/shardsui/src/lib/components/slider/` was inspected, including
the root state, math helpers, context, every part, and public exports. The Slider
documentation, all four demos, every Slider test and fixture, and the installed
declaration files were also inspected.

Shards supplies the pointer, touch, keyboard, form, field, RTL, orientation,
range, collision, formatting, and ARIA relationship behavior. The COSS wrappers
do not replace that behavior. They add COSS styling, the exact part-level
`data-slot` markers, a React-compatible `defaultValue` convenience, and
automatic part composition. The COSS root itself has no `data-slot` attribute.

## Public Svelte API

The default Svelte composition is namespace-friendly:

```svelte
<Slider.Root bind:value min={0} max={100} aria-label="Volume" />
```

The styled parts are also available as `Slider.Control`, `Slider.Track`,
`Slider.Indicator`, `Slider.Thumb`, `Slider.Label`, and `Slider.Value`.
`Slider.SliderValue` is the named COSS-compatible alias for the styled value
component; the numeric value union is `SliderValueType`. The raw Shards
namespace is exported as `SliderPrimitive` for consumers that need fully manual
composition. Because the COSS root always appends its automatic control, manual
composition belongs under `SliderPrimitive.Root`, not inside `Slider.Root`.

`value` is the deliberate two-way Svelte contract. `defaultValue` is read once
when the wrapper is created and seeds an unbound slider without making later
changes to `defaultValue` control it. During server rendering, range sliders
receive explicit thumb indexes so their output is stable before context has DOM
registrations. When neither `value` nor `defaultValue` is present, the fallback
tracks `min` until the user changes the Slider.

## Particle coverage

The parity fixture includes every Slider particle whose existing dependencies
are already ported: `p-slider-1` through `p-slider-11`, `p-slider-14` through
`p-slider-18`, `p-slider-20`, and `p-slider-23`.

`p-slider-12`, `p-slider-13`, `p-slider-19`, `p-slider-21`, and `p-slider-22`
depend on Number Field and remain gated until that component is available. Their
source was still inspected so the Slider API does not preclude the eventual
examples. Slider also ungates the exact `p-field-16` example in the Field parity
fixture.

## Reference observations

The upstream component page and all 23 particles were rendered from the pinned
reference. Standard horizontal tracks render at four pixels high with a
16-by-16-pixel desktop thumb; vertical examples use a four-pixel-wide track.
The regular vertical minimum is 176 pixels, while the equalizer particle uses a
192-pixel container. Disabled controls expose disabled range inputs and use
`0.64` opacity. Range examples render one native range input per thumb.

The reference also confirmed the authored values and bounds, including the
three-thumb `20, 50, 80` example, the `5` to `35` custom range, the `5` to `1240`
price range, the vertical range, and the five-value equalizer. Registry metadata
constrains horizontal particles `p-slider-1` through `p-slider-16` and
`p-slider-23` to a full-width `max-w-64` preview. The vertical particles
`p-slider-17`, `p-slider-18`, and `p-slider-20` have no width constraint.

## Verification contract

Focused tests cover server output and stable range-thumb counts, public types,
hydration, bound and default values, pointer and track interaction, committed
values, a rejecting function-binding setter, reactive `min` fallback, keyboard
increments and large steps, Home and End, vertical sliders, horizontal RTL
behavior, disabled state, form inputs, `none` and `swap` range collisions,
forwarded classes and refs, and accessible slider semantics. The non-gated
fixture keeps one explicit anchor per included COSS particle for visual review.

## D5 documentation port

The D5 lane re-read the Slider MDX page, all 23 particles, the target Slider, and the complete matching local Shards implementation, tests, docs, and examples. All 23 particles now have Svelte registry sources, including the formerly dependency-gated Number Field examples. The documentation page intentionally follows the pinned source order, including its authored heading/example mismatch: the Range Slider heading renders disabled `p-slider-3`, Vertical renders storage `p-slider-4`, and Form renders ticks `p-slider-5`. In the Codex in-app Browser at 1440×900, the live values were 50, 50, 50 disabled, 15 in the 5–35 range, and 5 in the 0–12 range. Focused browser coverage verifies step-button and ArrowRight synchronization. The form example prevents native navigation, captures both range values before loading, and reports `Volume: 25, 75`; the production-preview test also asserts that the query stays unchanged. Shared page metadata remains coordinator-owned.

## Central Hugeicons renderer migration

The p-slider-11, p-slider-14, and p-slider-21 registry sources keep their audited Hugeicons core glyph data, two-pixel strokes, classes, and ARIA attributes. They now render that data with the public SSR-safe HugeiconsIcon exported by @coss-sv/ui. The focused ownership test enumerates each migrated particle, rejects the framework-specific renderer, checks every icon invocation, and verifies server-rendered SVG geometry.
