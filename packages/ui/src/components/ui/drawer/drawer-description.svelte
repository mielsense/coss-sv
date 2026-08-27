<script module lang="ts">
import type { Dialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type DrawerDescriptionProps = ComponentProps<typeof ShardsP.Description>;
</script>
<script lang="ts">
import { Dialog as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, ref = $bindable(null), ...props }: DrawerDescriptionProps = $props();
</script>
<P.Description
  bind:ref
  class={cn("text-muted-foreground text-sm", className)}
  data-slot="drawer-description"
  {...props}
/>
