<script module lang="ts">
  import type { Dialog as ShardsDialog } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";
  export type CommandDialogViewportProps = ComponentProps<typeof ShardsDialog.Viewport>;
</script>

<script lang="ts">
  import { Dialog as DialogPrimitive } from "@shardsui/svelte/dialog";
  import { cn } from "@/utils.js";
  let { class: className, ref = $bindable(null), ...props }: CommandDialogViewportProps = $props();
</script>

<DialogPrimitive.Viewport
  bind:ref
  class={cn(
    "fixed inset-0 z-50 flex flex-col items-center px-4 py-[max(--spacing(4),4vh)] sm:py-[10vh]",
    className,
  )}
  data-slot="command-dialog-viewport"
  {...props}
/>
