<script module lang="ts">
import type { Dialog as ShardsP } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
import type { SheetSide, SheetVariant } from "./sheet-viewport.svelte";
export type SheetPopupProps = ComponentProps<typeof ShardsP.Popup> & {
  closeProps?: ComponentProps<typeof ShardsP.Close>;
  portalProps?: ComponentProps<typeof ShardsP.Portal>;
  showCloseButton?: boolean;
  side?: SheetSide;
  variant?: SheetVariant;
};
</script>
<script lang="ts">
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Dialog as P } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
import { buttonVariants } from "../button/button.svelte";
import Backdrop from "./sheet-backdrop.svelte";
import Viewport from "./sheet-viewport.svelte";

let {
  children: child,
  class: className,
  closeProps = {},
  portalProps = {},
  ref = $bindable(null),
  showCloseButton = true,
  side = "right",
  variant = "default",
  ...props
}: SheetPopupProps = $props();
const classes = $derived(
  cn(
    "relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 transition-[opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:opacity-0 data-starting-style:opacity-0 max-sm:before:hidden dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
    side === "bottom" &&
      "row-start-2 border-t data-ending-style:translate-y-8 data-starting-style:translate-y-8",
    side === "top" &&
      "border-b data-ending-style:-translate-y-8 data-starting-style:-translate-y-8",
    side === "left" &&
      "w-[calc(100%-(--spacing(12)))] max-w-md border-e data-ending-style:-translate-x-8 data-starting-style:-translate-x-8",
    side === "right" &&
      "col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md border-s data-ending-style:translate-x-8 data-starting-style:translate-x-8",
    variant === "inset" &&
      "before:hidden sm:rounded-2xl sm:border sm:before:rounded-[calc(var(--radius-2xl)-1px)] sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]",
    className,
  ),
);
</script>
<P.Portal {...portalProps}
  ><Backdrop />
  <Viewport {side} {variant}
    ><P.Popup bind:ref class={classes} data-slot="sheet-popup" {...props}
      >{#snippet children(state)}
        {@render child?.(state)}
        {#if showCloseButton}
          <P.Close
            aria-label="Close"
            class={buttonVariants({ class: "absolute end-2 top-2", size: "icon", variant: "ghost" })}
            data-slot="button"
            {...closeProps}
            ><HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} /></P.Close
          >
        {/if}
      {/snippet}</P.Popup
    ></Viewport
  ></P.Portal
>
