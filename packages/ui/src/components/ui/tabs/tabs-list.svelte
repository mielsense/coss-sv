<script module lang="ts">
  import type { Tabs as ShardsTabs } from "@shardsui/svelte/tabs";
  import type { ComponentProps } from "svelte";
  import type { TabsSize, TabsVariant } from "./tabs-styles.js";

  export type TabsListProps = ComponentProps<typeof ShardsTabs.List> & {
    size?: TabsSize;
    variant?: TabsVariant;
  };
</script>

<script lang="ts">
  import { Tabs as TabsPrimitive } from "@shardsui/svelte/tabs";
  import { cn } from "@/utils.js";
  import { setTabsListStyleContext } from "./context.js";
  import TabsIndicator from "./tabs-indicator.svelte";

  let {
    children: child,
    class: className,
    ref = $bindable(null),
    size = "default",
    variant = "default",
    ...props
  }: TabsListProps = $props();

  setTabsListStyleContext({
    get size() {
      return size;
    },
    get variant() {
      return variant;
    },
  });
</script>

<TabsPrimitive.List
  bind:ref
  class={cn(
    "relative z-0 flex w-fit items-center justify-center gap-x-0.5 text-muted-foreground",
    "data-[orientation=vertical]:flex-col",
    variant === "default"
      ? "rounded-lg bg-muted p-0.5 text-muted-foreground/72"
      : "data-[orientation=vertical]:px-1 data-[orientation=horizontal]:py-1 *:data-[slot=tabs-tab]:hover:bg-accent",
    className,
  )}
  data-size={size}
  data-slot="tabs-list"
  {...props}
>
  {#snippet children(state)}
    {@render child?.(state)}
    <TabsIndicator />
  {/snippet}
</TabsPrimitive.List>
