<script module lang="ts">
import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ContextMenuTriggerProps = ComponentProps<typeof ShardsContextMenu.Trigger>;
</script>

<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "@shardsui/svelte";
import { getMenuIdContext } from "../menu/id-context.js";

let {
  "aria-controls": ariaControls,
  ref = $bindable(null),
  ...props
}: ContextMenuTriggerProps = $props();
const menuIds = getMenuIdContext();
const resolvedControls = $derived(ariaControls ?? (menuIds.open ? menuIds.popupId : undefined));
</script>

<ContextMenuPrimitive.Trigger
  aria-controls={resolvedControls}
  bind:ref
  data-slot="context-menu-trigger"
  {...props}
/>
