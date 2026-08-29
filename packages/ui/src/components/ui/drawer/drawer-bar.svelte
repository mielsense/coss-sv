<script module lang="ts">
  import type { DrawerPartProps } from "./drawer-part.svelte";
  import type { DrawerPosition } from "./context.js";
  export type DrawerBarProps = DrawerPartProps & { position?: DrawerPosition };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { getDrawerPositionContext } from "./context.js";
  import DrawerPart from "./drawer-part.svelte";
  let {
    class: className,
    position: positionProp,
    ref = $bindable(null),
    ...props
  }: DrawerBarProps = $props();
  const context = getDrawerPositionContext();
  const position = $derived(positionProp ?? context.position);
  const horizontal = $derived(position === "left" || position === "right");
  const classes = $derived(
    cn(
      "absolute flex touch-none items-center justify-center p-3 before:rounded-full before:bg-input",
      horizontal ? "inset-y-0 before:h-12 before:w-1" : "inset-x-0 before:h-1 before:w-12",
      position === "top" && "bottom-0",
      position === "bottom" && "top-0",
      position === "left" && "right-0",
      position === "right" && "left-0",
      className,
    ),
  );
</script>

<DrawerPart aria-hidden="true" bind:ref baseClass={classes} dataSlot="drawer-bar" {...props} />
