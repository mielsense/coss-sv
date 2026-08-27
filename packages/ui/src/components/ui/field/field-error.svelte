<script module lang="ts">
import { Field as FieldPrimitive } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type FieldErrorProps = ComponentProps<typeof FieldPrimitive.Error>;
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: FieldErrorProps = $props();
</script>

<FieldPrimitive.Error
  bind:ref
  data-slot="field-error"
  class={cn("text-destructive-foreground text-xs", className)}
  {...props}
/>
