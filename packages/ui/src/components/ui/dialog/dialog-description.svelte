<script module lang="ts">
  import type { Dialog as ShardsDialog } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";
  export type DialogDescriptionProps = ComponentProps<typeof ShardsDialog.Description>;
</script>

<script lang="ts">
  import { Dialog as DialogPrimitive } from "@shardsui/svelte/dialog";
  import { cn } from "@/utils.js";
  let { class: className, ref = $bindable(null), ...props }: DialogDescriptionProps = $props();
</script>

<DialogPrimitive.Description
  bind:ref
  class={cn("text-muted-foreground text-sm", className)}
  data-slot="dialog-description"
  {...props}
/>
