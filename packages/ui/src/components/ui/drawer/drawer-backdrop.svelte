<script module lang="ts">
import type { DialogBackdropProps } from "../dialog/dialog-backdrop.svelte";
export type DrawerBackdropProps = DialogBackdropProps;
</script>
<script lang="ts">
import { Drawer as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, ref = $bindable(null), ...props }: DrawerBackdropProps = $props();
</script>
<P.Backdrop
  bind:ref
  class={cn("fixed inset-0 z-50 bg-black/32 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-sm transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute", className)}
  data-slot="drawer-backdrop"
  {...props}
/>
