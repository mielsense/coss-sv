<script module lang="ts">
import { Fieldset as FieldsetPrimitive } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type FieldsetRootProps = ComponentProps<typeof FieldsetPrimitive.Root>;
</script>

<script lang="ts">
import { createFieldsetCompositionContext } from "./context.svelte.js";

let {
  class: className,
  disabled = false,
  ref = $bindable(null),
  ...props
}: FieldsetRootProps = $props();

const context = createFieldsetCompositionContext(() => disabled);
</script>

<FieldsetPrimitive.Root
  bind:ref
  {disabled}
  aria-labelledby={context.legendId}
  data-slot="fieldset"
  class={className}
  {...props}
/>
