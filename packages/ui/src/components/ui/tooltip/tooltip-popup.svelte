<script module lang="ts">
import type { Tooltip as ShardsTooltip } from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";
type PopupProps = ComponentProps<typeof ShardsTooltip.Popup>;
type PositionerProps = ComponentProps<typeof ShardsTooltip.Positioner>;
export type TooltipPortalProps = ComponentProps<typeof ShardsTooltip.Portal>;
export type TooltipPopupProps = Omit<PopupProps, "children"> & {
  align?: PositionerProps["align"];
  anchor?: PositionerProps["anchor"];
  children?: Snippet;
  portalProps?: TooltipPortalProps;
  side?: PositionerProps["side"];
  sideOffset?: PositionerProps["sideOffset"];
};
</script>
<script lang="ts">
import { Tooltip as TooltipPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import { getTooltipHandleContext } from "./context.js";
const uid = $props.id();
let {
  align = "center",
  anchor,
  children: child,
  class: className,
  id = uid,
  portalProps,
  ref = $bindable(null),
  side = "top",
  sideOffset = 4,
  ...props
}: TooltipPopupProps = $props();
const handle = getTooltipHandleContext();
$effect.pre(() => {
  handle.popupId = id;
  return () => {
    if (handle.popupId === id) handle.popupId = undefined;
  };
});
const positionerProps = $derived({
  align,
  ...(anchor === undefined ? {} : { anchor }),
  side,
  sideOffset,
});
</script>
<TooltipPrimitive.Portal {...portalProps}>
  <TooltipPrimitive.Positioner
    class="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] data-instant:transition-none"
    data-slot="tooltip-positioner"
    {...positionerProps}
  >
    <TooltipPrimitive.Popup
      bind:ref
      class={cn("relative flex h-(--popup-height,auto) w-(--popup-width,auto) origin-(--transform-origin) text-balance rounded-md border bg-popover not-dark:bg-clip-padding text-popover-foreground text-xs shadow-md/5 transition-[width,height,scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 data-instant:duration-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", className)}
      data-slot="tooltip-popup"
      {id}
      role="tooltip"
      {...props}
    >
      <TooltipPrimitive.Viewport
        class="relative size-full overflow-clip px-(--viewport-inline-padding) py-1 [--viewport-inline-padding:--spacing(2)] data-instant:transition-none **:data-current:data-ending-style:opacity-0 **:data-current:data-starting-style:opacity-0 **:data-previous:data-ending-style:opacity-0 **:data-previous:data-starting-style:opacity-0 **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:truncate **:data-current:opacity-100 **:data-previous:opacity-100 **:data-current:transition-opacity **:data-previous:transition-opacity"
        data-slot="tooltip-viewport"
      >
        {@render child?.()}
      </TooltipPrimitive.Viewport>
    </TooltipPrimitive.Popup>
  </TooltipPrimitive.Positioner>
</TooltipPrimitive.Portal>
