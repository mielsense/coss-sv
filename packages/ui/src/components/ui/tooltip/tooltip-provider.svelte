<script module lang="ts">
import type { Tooltip as ShardsTooltip } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type TooltipProviderProps = ComponentProps<typeof ShardsTooltip.Provider>;
</script>
<script lang="ts">
import { Tooltip as TooltipPrimitive } from "@shardsui/svelte";
let { children: child, ...props }: TooltipProviderProps = $props();
</script>
<TooltipPrimitive.Provider {...props}>{@render child?.()}</TooltipPrimitive.Provider>
