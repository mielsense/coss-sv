<script module lang="ts">
import type { Drawer as ShardsP } from "@shardsui/svelte";
import type { ComponentProps, Snippet } from "svelte";
import type { DrawerPosition } from "./context.js";
type PrimitiveRootProps = ComponentProps<typeof ShardsP.Root>;
export type DrawerRootProps<Payload = unknown> = Omit<PrimitiveRootProps, "children" | "handle"> & {
  position?: DrawerPosition;
  handle?: ShardsP.Handle<Payload>;
  children?: Snippet<[{ payload: Payload | undefined }]>;
};
</script>
<script lang="ts" generics="Payload = unknown">
import { Drawer as P } from "@shardsui/svelte";
import { setDrawerPositionContext } from "./context.js";
let {
  open = $bindable(false),
  position = "bottom",
  snapPoints,
  snapPoint = $bindable(snapPoints?.[0] ?? null),
  swipeDirection,
  triggerId = $bindable(null),
  ...props
}: DrawerRootProps<Payload> = $props();
const direction = $derived(
  swipeDirection ??
    ({ bottom: "down", left: "left", right: "right", top: "up" } as const)[position],
);
const snapPointsProps = $derived(snapPoints ? { snapPoints } : {});
setDrawerPositionContext({
  get position() {
    return position;
  },
});
</script>
<P.Root
  bind:open
  bind:snapPoint
  bind:triggerId
  {...snapPointsProps}
  swipeDirection={direction}
  {...props}
/>
