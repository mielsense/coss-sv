<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import type { ContextMenuPopupProps } from "./context-menu.types.js";
import { getContextMenuIdContext } from "./id-context.svelte.js";

const popupClass =
  "relative flex not-[class*='w-']:min-w-32 origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] focus:outline-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)]";
let {
  align = "center",
  alignOffset,
  anchor,
  children: child,
  class: className,
  id,
  portalProps,
  ref = $bindable(null),
  side = "bottom",
  sideOffset = 4,
  ...props
}: ContextMenuPopupProps = $props();
const alignOffsetProps = $derived(alignOffset === undefined ? {} : { alignOffset });
const anchorProps = $derived(anchor === undefined ? {} : { anchor });
const menuIds = getContextMenuIdContext();
const popupId = $derived(id ?? menuIds.popupId);

$effect.pre(() => {
  menuIds.setPopupId(popupId);
});
</script>

<ContextMenuPrimitive.Portal {...portalProps}>
  <ContextMenuPrimitive.Positioner
    {align}
    {...alignOffsetProps}
    {...anchorProps}
    class="z-50"
    data-slot="context-menu-positioner"
    {side}
    {sideOffset}
  >
    <ContextMenuPrimitive.Popup
      bind:ref
      class={cn(popupClass, className)}
      data-slot="context-menu-popup"
      id={popupId}
      {...props}
    >
      {#snippet children(state)}
        <div class="max-h-(--available-height) w-full overflow-y-auto p-1">
          {@render child?.(state)}
        </div>
      {/snippet}
    </ContextMenuPrimitive.Popup>
  </ContextMenuPrimitive.Positioner>
</ContextMenuPrimitive.Portal>
