<script module lang="ts">
import type { Tabs as ShardsTabs } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type TabsPanelProps = ComponentProps<typeof ShardsTabs.Panel>;
</script>

<script lang="ts">
import { Tabs as TabsPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: TabsPanelProps = $props();
</script>

<TabsPrimitive.Panel
  bind:ref
  class={cn("flex-1 outline-none", className)}
  data-slot="tabs-content"
  {...props}
/>
