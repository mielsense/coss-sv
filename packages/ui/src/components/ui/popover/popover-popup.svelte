<script module lang="ts">
  import type { Popover as ShardsPopover } from "@shardsui/svelte";
  import type { ComponentProps, Snippet } from "svelte";

  type PopupProps = ComponentProps<typeof ShardsPopover.Popup>;
  type PositionerProps = ComponentProps<typeof ShardsPopover.Positioner>;
  export type PopoverPortalProps = ComponentProps<typeof ShardsPopover.Portal>;

  export type PopoverPopupProps = Omit<PopupProps, "children"> & {
    align?: PositionerProps["align"];
    alignOffset?: PositionerProps["alignOffset"];
    anchor?: PositionerProps["anchor"];
    children?: Snippet;
    portalProps?: PopoverPortalProps;
    side?: PositionerProps["side"];
    sideOffset?: PositionerProps["sideOffset"];
    tooltipStyle?: boolean;
  };
</script>

<script lang="ts">
  import { Popover as PopoverPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";

  let {
    align = "center",
    alignOffset = 0,
    anchor,
    children: child,
    class: className,
    portalProps,
    ref = $bindable(null),
    side = "bottom",
    sideOffset = 4,
    tooltipStyle = false,
    ...props
  }: PopoverPopupProps = $props();

  const positionerProps = $derived({
    align,
    alignOffset,
    ...(anchor === undefined ? {} : { anchor }),
    side,
    sideOffset,
  });
</script>

<PopoverPrimitive.Portal {...portalProps}>
  <PopoverPrimitive.Positioner
    class="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] data-instant:transition-none"
    data-slot="popover-positioner"
    {...positionerProps}
  >
    <PopoverPrimitive.Popup
      bind:ref
      class={cn(
        "relative flex h-(--popup-height,auto) w-(--popup-width,auto) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none transition-[width,height,scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] has-data-[slot=calendar]:rounded-xl has-data-[slot=calendar]:before:rounded-[calc(var(--radius-xl)-1px)] data-starting-style:scale-98 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        tooltipStyle &&
          "w-fit text-balance rounded-md text-xs shadow-md/5 before:rounded-[calc(var(--radius-md)-1px)]",
        className,
      )}
      data-slot="popover-popup"
      {...props}
    >
      <PopoverPrimitive.Viewport
        class={cn(
          "relative size-full max-h-(--available-height) overflow-clip px-(--viewport-inline-padding) py-4 [--viewport-inline-padding:--spacing(4)] has-data-[slot=calendar]:p-2 data-instant:transition-none **:data-current:data-ending-style:opacity-0 **:data-current:data-starting-style:opacity-0 **:data-previous:data-ending-style:opacity-0 **:data-previous:data-starting-style:opacity-0 **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-current:opacity-100 **:data-previous:opacity-100 **:data-current:transition-opacity **:data-previous:transition-opacity",
          tooltipStyle
            ? "py-1 [--viewport-inline-padding:--spacing(2)]"
            : "not-data-transitioning:overflow-y-auto",
        )}
        data-slot="popover-viewport"
      >
        {@render child?.()}
      </PopoverPrimitive.Viewport>
    </PopoverPrimitive.Popup>
  </PopoverPrimitive.Positioner>
</PopoverPrimitive.Portal>
