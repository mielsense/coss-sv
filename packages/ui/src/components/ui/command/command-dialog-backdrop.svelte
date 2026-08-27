<script module lang="ts">
import type { Dialog as ShardsDialog } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type CommandDialogBackdropProps = ComponentProps<typeof ShardsDialog.Backdrop>;
</script>

<script lang="ts">
import { Dialog as DialogPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, ref = $bindable(null), ...props }: CommandDialogBackdropProps = $props();
</script>

<DialogPrimitive.Backdrop
  bind:ref
  class={cn("fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0", className)}
  data-slot="command-dialog-backdrop"
  {...props}
/>
