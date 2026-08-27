<script module lang="ts">
import type { Select as ShardsSelect } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type SelectLabelProps = ComponentProps<typeof ShardsSelect.Label>;
</script>
<script lang="ts">
import { Select as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, ref = $bindable(null), ...props }: SelectLabelProps = $props();
</script>
<P.Label
  bind:ref
  class={cn("px-2 py-1.5 font-medium text-muted-foreground text-xs",className)}
  data-slot="select-label"
  {...props}
/>
