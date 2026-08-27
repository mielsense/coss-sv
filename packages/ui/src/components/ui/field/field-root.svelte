<script module lang="ts">
import { Field as FieldPrimitive } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type FieldRootProps = ComponentProps<typeof FieldPrimitive.Root>;
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";
import { createFieldsetCompositionContext } from "../fieldset/context.svelte.js";

let {
  as = "div",
  class: className,
  disabled = false,
  ref = $bindable(null),
  ...props
}: FieldRootProps = $props();

const fieldsetContext = createFieldsetCompositionContext(
  () => disabled,
  () => as === "fieldset",
);

// Shards consumes its lowercase `disabled` prop for Field state. HTML attribute names are
// ASCII-case-insensitive, while Svelte normalizes spread attributes during SSR and in the DOM,
// so this distinct component prop reaches the same root as a native `disabled` attribute.
const nativeFieldsetAttributes = $derived(as === "fieldset" && disabled ? { DISABLED: true } : {});
</script>

<FieldPrimitive.Root
  {as}
  bind:ref
  {disabled}
  aria-labelledby={as === "fieldset" ? fieldsetContext.legendId : undefined}
  data-slot="field"
  class={cn("flex flex-col items-start gap-2", className)}
  {...nativeFieldsetAttributes}
  {...props}
/>
