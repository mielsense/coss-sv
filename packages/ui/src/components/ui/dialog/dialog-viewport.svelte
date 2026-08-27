<script module lang="ts">
import type { Dialog as ShardsDialog } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type DialogViewportProps = ComponentProps<typeof ShardsDialog.Viewport>;
</script>
<script lang="ts">
import { Dialog as DialogPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, ref = $bindable(null), ...props }: DialogViewportProps = $props();
</script>
<DialogPrimitive.Viewport
  bind:ref
  class={cn("fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4", className)}
  data-slot="dialog-viewport"
  {...props}
/>
