<script module lang="ts">
import type { RadioGroup as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type DrawerMenuRadioGroupProps = ComponentProps<typeof ShardsP>;
</script>
<script lang="ts">
import { RadioGroup as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let {
  class: className,
  ref = $bindable(null),
  value = $bindable(null),
  ...props
}: DrawerMenuRadioGroupProps = $props();
</script>
<P
  bind:ref
  bind:value
  class={cn("flex flex-col", className)}
  data-slot="drawer-menu-radio-group"
  {...props}
/>
