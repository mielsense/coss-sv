<script module lang="ts">
  import { Fieldset as FieldsetPrimitive } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";

  export type FieldsetRootProps = ComponentProps<typeof FieldsetPrimitive.Root> & {
    /**
     * Hydration-stable ID shared with an explicitly identified `Fieldset.Legend`.
     * The generated default is used by a Legend without an explicit ID.
     */
    legendId?: string;
  };
</script>

<script lang="ts">
  import { createFieldsetCompositionContext } from "./context.svelte.js";

  const uid = $props.id();
  let {
    class: className,
    disabled = false,
    legendId = `${uid}-legend`,
    ref = $bindable(null),
    ...props
  }: FieldsetRootProps = $props();

  const context = createFieldsetCompositionContext(
    () => disabled,
    () => true,
    () => legendId,
  );
</script>

<FieldsetPrimitive.Root
  bind:ref
  {disabled}
  aria-labelledby={context.legendId}
  data-slot="fieldset"
  class={className}
  {...props}
/>
