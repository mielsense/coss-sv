<script module lang="ts">
import type { Tabs as ShardsTabs, TabsValue } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type TabsRootProps = Omit<ComponentProps<typeof ShardsTabs.Root>, "value"> & {
  defaultValue?: TabsValue;
  value?: TabsValue | undefined;
};
</script>

<script lang="ts">
import { Tabs as TabsPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";
import { cn } from "../../../lib/utils.js";

let {
  class: className,
  defaultValue,
  ref = $bindable(null),
  value = $bindable(),
  ...props
}: TabsRootProps = $props();

const initialValue = untrack(() => defaultValue);

function getValue(): TabsValue {
  return (value === undefined ? initialValue : value) as TabsValue;
}

function setValue(next: TabsValue): void {
  value = next;
}
</script>

<TabsPrimitive.Root
  bind:ref
  bind:value={getValue, setValue}
  class={cn("flex flex-col gap-2 data-[orientation=vertical]:flex-row", className)}
  data-slot="tabs"
  {...props}
/>
