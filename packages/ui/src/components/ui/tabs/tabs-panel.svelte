<script module lang="ts">
  import type { Tabs as ShardsTabs } from "@shardsui/svelte/tabs";
  import type { ComponentProps } from "svelte";
  import type { TabsValue } from "./tabs-value.js";

  export type TabsPanelProps<Value = TabsValue> = Omit<
    ComponentProps<typeof ShardsTabs.Panel>,
    "value"
  > & { value: Value };
</script>

<script lang="ts" generics="Value = TabsValue">
  import { Tabs as TabsPrimitive, type TabsValue as ShardsTabsValue } from "@shardsui/svelte/tabs";
  import { cn } from "@/utils.js";

  let {
    class: className,
    ref = $bindable(null),
    value,
    ...props
  }: TabsPanelProps<Value> = $props();

  const primitiveValue = $derived(value as ShardsTabsValue);
</script>

<TabsPrimitive.Panel
  bind:ref
  class={cn("flex-1 outline-none", className)}
  data-slot="tabs-content"
  value={primitiveValue}
  {...props}
/>
