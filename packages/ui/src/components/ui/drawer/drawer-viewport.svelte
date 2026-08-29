<script module lang="ts">
  import type { Drawer as ShardsP } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  import type { DrawerPosition } from "./context.js";
  export type DrawerVariant = "default" | "straight" | "inset";
  export type DrawerViewportProps = ComponentProps<typeof ShardsP.Viewport> & {
    position?: DrawerPosition;
    variant?: DrawerVariant;
  };
</script>

<script lang="ts">
  import { Drawer as P } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  let {
    class: className,
    position,
    ref = $bindable(null),
    variant = "default",
    ...props
  }: DrawerViewportProps = $props();
  const classes = $derived(
    cn(
      "fixed inset-0 z-50 [--bleed:--spacing(12)] [--inset:0px]",
      "touch-none",
      position === "bottom" && "grid grid-rows-[1fr_auto] pt-12",
      position === "top" && "grid grid-rows-[auto_1fr] pb-12",
      position === "left" && "flex justify-start",
      position === "right" && "flex justify-end",
      variant === "inset" && "px-(--inset) sm:[--inset:--spacing(4)]",
      variant === "inset" && position !== "bottom" && "pt-(--inset)",
      variant === "inset" && position !== "top" && "pb-(--inset)",
      className,
    ),
  );
</script>

<P.Viewport bind:ref class={classes} data-slot="drawer-viewport" {...props} />
