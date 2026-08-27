<script module lang="ts">
import type { AlertDialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AlertDialogViewportProps = ComponentProps<typeof ShardsP.Viewport>;
</script>
<script lang="ts">
import { AlertDialog as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, ref = $bindable(null), ...props }: AlertDialogViewportProps = $props();
</script>
<P.Viewport
  bind:ref
  class={cn("fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4", className)}
  data-slot="alert-dialog-viewport"
  {...props}
/>
