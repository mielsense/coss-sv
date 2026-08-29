<script module lang="ts">
  import type { Tabs as ShardsTabs } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  import type { TabsSize } from "./tabs-styles.js";

  export type TabsTabProps = ComponentProps<typeof ShardsTabs.Tab> & {
    size?: TabsSize;
  };
</script>

<script lang="ts">
  import { Tabs as TabsPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  import { getTabsListStyleContext } from "./context.js";
  import { tabsItemLayoutClassName, tabsItemSizeClassNames } from "./tabs-styles.js";

  let {
    class: className,
    ref = $bindable(null),
    size: sizeProp,
    ...props
  }: TabsTabProps = $props();

  const context = getTabsListStyleContext();
  const size = $derived(sizeProp ?? context.size);
</script>

<TabsPrimitive.Tab
  bind:ref
  class={cn(
    "relative flex shrink-0 grow cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-transparent font-medium text-base outline-none transition-[color,background-color,box-shadow] hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring data-disabled:pointer-events-none data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-active:text-foreground data-disabled:opacity-64 sm:text-sm",
    tabsItemLayoutClassName,
    tabsItemSizeClassNames[size],
    className,
  )}
  data-size={size}
  data-slot="tabs-tab"
  {...props}
/>
