<script module lang="ts">
  import type { DialogViewportProps } from "../dialog/dialog-viewport.svelte";
  export type AlertDialogViewportProps = DialogViewportProps;
</script>

<script lang="ts">
  import { AlertDialog as P } from "@shardsui/svelte/alert-dialog";
  import { cn } from "@/utils.js";
  let { class: className, ref = $bindable(null), ...props }: AlertDialogViewportProps = $props();
</script>

<P.Viewport
  bind:ref
  class={cn("fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4", className)}
  data-slot="alert-dialog-viewport"
  {...props}
/>
