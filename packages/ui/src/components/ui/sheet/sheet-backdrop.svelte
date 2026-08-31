<script module lang="ts">
  import type { DialogBackdropProps } from "../dialog/dialog-backdrop.svelte";
  export type SheetBackdropProps = DialogBackdropProps;
</script>

<script lang="ts">
  import { Dialog as P } from "@shardsui/svelte/dialog";
  import { cn } from "@/utils.js";
  let { class: className, ref = $bindable(null), ...props }: SheetBackdropProps = $props();
</script>

<P.Backdrop
  bind:ref
  class={cn(
    "fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
    className,
  )}
  data-slot="sheet-backdrop"
  {...props}
/>
