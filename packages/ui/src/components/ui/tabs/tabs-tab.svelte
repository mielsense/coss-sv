<script module lang="ts">
  import type { Tabs as ShardsTabs } from "@shardsui/svelte/tabs";
  import type { ComponentProps } from "svelte";
  import type { TabsSize } from "./tabs-styles.js";
  import type { TabsValue } from "./tabs-value.js";

  export type TabsTabProps<Value = TabsValue> = Omit<
    ComponentProps<typeof ShardsTabs.Tab>,
    "value"
  > & {
    size?: TabsSize;
    value: Value;
  };
</script>

<script lang="ts" generics="Value = TabsValue">
  import { Tabs as TabsPrimitive, type TabsValue as ShardsTabsValue } from "@shardsui/svelte/tabs";
  import { cn } from "@/utils.js";
  import { getTabsListStyleContext, getTabsRootAdapterContext } from "./context.js";
  import { tabsItemLayoutClassName, tabsItemSizeClassNames } from "./tabs-styles.js";

  let {
    class: className,
    disabled = false,
    onclick,
    onfocus,
    ref = $bindable(null),
    size: sizeProp,
    value,
    ...props
  }: TabsTabProps<Value> = $props();

  const context = getTabsListStyleContext();
  const root = getTabsRootAdapterContext();
  const size = $derived(sizeProp ?? context.size);
  const primitiveValue = $derived(value as ShardsTabsValue);

  $effect(() => {
    const element = ref;
    if (!element) return;
    return root.registerTab({ disabled, element, value });
  });
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
  {disabled}
  onclick={(event) => {
    root.recordEvent(event);
    onclick?.(event);
  }}
  onfocus={(event) => {
    root.recordEvent(event);
    onfocus?.(event);
  }}
  value={primitiveValue}
  {...props}
/>
