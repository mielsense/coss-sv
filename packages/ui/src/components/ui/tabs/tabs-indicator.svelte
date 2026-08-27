<script module lang="ts">
import type { Tabs as ShardsTabs } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type TabsIndicatorProps = ComponentProps<typeof ShardsTabs.Indicator>;
</script>

<script lang="ts">
import { Tabs as TabsPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import { getTabsListStyleContext } from "./context.js";

let { class: className, ref = $bindable(null), ...props }: TabsIndicatorProps = $props();

const context = getTabsListStyleContext();
</script>

<TabsPrimitive.Indicator
  bind:ref
  class={cn(
    "absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out",
    context.variant === "underline"
      ? "z-10 bg-primary data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:-translate-x-px data-[orientation=horizontal]:translate-y-px"
      : "-z-1 rounded-md bg-background shadow-sm/5 dark:bg-input",
    className,
  )}
  data-slot="tab-indicator"
  {...props}
/>
