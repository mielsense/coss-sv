<script module lang="ts">
import type { Dialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SheetTitleProps = ComponentProps<typeof ShardsP.Title>;
</script>
<script lang="ts">
import { Dialog as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, ref = $bindable(null), ...props }: SheetTitleProps = $props();
</script>
<P.Title
  bind:ref
  class={cn("font-heading font-semibold text-xl leading-none", className)}
  data-slot="sheet-title"
  {...props}
/>
