<script module lang="ts">
import type { PreviewCard as ShardsPreviewCard } from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";

type PopupProps = ComponentProps<typeof ShardsPreviewCard.Popup>;
type PositionerProps = ComponentProps<typeof ShardsPreviewCard.Positioner>;
export type PreviewCardPortalProps = ComponentProps<typeof ShardsPreviewCard.Portal>;
export type PreviewCardPopupProps = Omit<PopupProps, "children"> & {
  align?: PositionerProps["align"];
  anchor?: PositionerProps["anchor"];
  children?: Snippet;
  portalProps?: PreviewCardPortalProps;
  side?: PositionerProps["side"];
  sideOffset?: PositionerProps["sideOffset"];
};
</script>
<script lang="ts">
import { PreviewCard as PreviewCardPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let {
  align = "center",
  anchor,
  children: child,
  class: className,
  portalProps,
  ref = $bindable(null),
  side,
  sideOffset = 4,
  ...props
}: PreviewCardPopupProps = $props();
const positionerProps = $derived({
  align,
  ...(anchor === undefined ? {} : { anchor }),
  ...(side === undefined ? {} : { side }),
  sideOffset,
});
</script>
<PreviewCardPrimitive.Portal {...portalProps}>
  <PreviewCardPrimitive.Positioner
    class="z-50"
    data-slot="preview-card-positioner"
    {...positionerProps}
  >
    <PreviewCardPrimitive.Popup
      bind:ref
      class={cn("relative flex w-64 origin-(--transform-origin) text-balance rounded-lg border bg-popover not-dark:bg-clip-padding p-4 text-popover-foreground text-sm shadow-lg/5 transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]", className)}
      data-slot="preview-card-content"
      {...props}
    >
      {@render child?.()}
    </PreviewCardPrimitive.Popup>
  </PreviewCardPrimitive.Positioner>
</PreviewCardPrimitive.Portal>
