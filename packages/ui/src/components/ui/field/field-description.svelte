<script module lang="ts">
import { Field as FieldPrimitive } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type FieldDescriptionProps = ComponentProps<typeof FieldPrimitive.Description>;
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: FieldDescriptionProps = $props();
</script>

<FieldPrimitive.Description
  bind:ref
  data-slot="field-description"
  class={cn("text-muted-foreground text-xs", className)}
  {...props}
/>
