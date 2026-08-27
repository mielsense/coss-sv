<script module lang="ts">
import type { Menu as ShardsMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type MenuTriggerProps = ComponentProps<typeof ShardsMenu.Trigger>;
</script>

<script lang="ts">
import { Menu as MenuPrimitive } from "@shardsui/svelte";
import { getMenuIdContext } from "./id-context.js";

let { "aria-controls": ariaControls, ref = $bindable(null), ...props }: MenuTriggerProps = $props();
const menuIds = getMenuIdContext();
const resolvedControls = $derived(ariaControls ?? (menuIds.open ? menuIds.popupId : undefined));
</script>

<MenuPrimitive.Trigger
  aria-controls={resolvedControls}
  bind:ref
  data-slot="menu-trigger"
  {...props}
/>
