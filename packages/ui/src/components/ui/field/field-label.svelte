<script module lang="ts">
import { Field as FieldPrimitive } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type FieldLabelProps = ComponentProps<typeof FieldPrimitive.Label>;
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: FieldLabelProps = $props();
</script>

<FieldPrimitive.Label
  bind:ref
  data-slot="field-label"
  class={cn(
    "inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground data-disabled:opacity-64 sm:text-sm/4",
    className,
  )}
  {...props}
/>
