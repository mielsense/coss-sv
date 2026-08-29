<script module lang="ts">
  import type { DialogBackdropProps } from "../dialog/dialog-backdrop.svelte";
  export type AlertDialogBackdropProps = DialogBackdropProps;
</script>

<script lang="ts">
  import { AlertDialog as P } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  let { class: className, ref = $bindable(null), ...props }: AlertDialogBackdropProps = $props();
</script>

<P.Backdrop
  bind:ref
  class={cn(
    "fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
    className,
  )}
  data-slot="alert-dialog-backdrop"
  {...props}
/>
