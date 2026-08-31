<script module lang="ts">
  import type { Dialog as ShardsDialog } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";

  type PrimitivePopupProps = ComponentProps<typeof ShardsDialog.Popup>;
  export type DialogPopupProps = PrimitivePopupProps & {
    bottomStickOnMobile?: boolean;
    closeProps?: ComponentProps<typeof ShardsDialog.Close>;
    portalProps?: ComponentProps<typeof ShardsDialog.Portal>;
    showCloseButton?: boolean;
  };
</script>

<script lang="ts">
  import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
  import HugeiconsIcon from "@/hugeicons-icon.svelte";
  import { Dialog as DialogPrimitive } from "@shardsui/svelte/dialog";
  import { cn } from "@/utils.js";
  import { buttonVariants } from "../button/button.svelte";
  import DialogBackdrop from "./dialog-backdrop.svelte";
  import DialogViewport from "./dialog-viewport.svelte";

  let {
    bottomStickOnMobile = true,
    children: child,
    class: className,
    closeProps = {},
    portalProps = {},
    ref = $bindable(null),
    showCloseButton = true,
    ...props
  }: DialogPopupProps = $props();

  const viewportClass = $derived(
    bottomStickOnMobile ? "max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12" : undefined,
  );
  const popupClass = $derived(
    cn(
      "relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 max-w-lg origin-center flex-col rounded-2xl border bg-popover not-dark:bg-clip-padding text-popover-foreground opacity-[calc(1-var(--nested-dialogs))] shadow-lg/5 outline-none transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:opacity-0 data-starting-style:opacity-0 sm:scale-[calc(1-0.1*var(--nested-dialogs))] sm:data-ending-style:scale-98 sm:data-starting-style:scale-98 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      bottomStickOnMobile &&
        "max-sm:max-w-none max-sm:origin-bottom max-sm:rounded-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0 max-sm:data-ending-style:translate-y-4 max-sm:data-starting-style:translate-y-4 max-sm:before:hidden max-sm:before:rounded-none",
      className,
    ),
  );
</script>

<DialogPrimitive.Portal {...portalProps}>
  <DialogBackdrop />
  <DialogViewport class={viewportClass}>
    <DialogPrimitive.Popup bind:ref class={popupClass} data-slot="dialog-popup" {...props}>
      {#snippet children(state)}
        {@render child?.(state)}
        {#if showCloseButton}
          <DialogPrimitive.Close
            aria-label="Close"
            class={buttonVariants({
              class: "absolute end-2 top-2",
              size: "icon",
              variant: "ghost",
            })}
            data-slot="button"
            {...closeProps}
          >
            <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
          </DialogPrimitive.Close>
        {/if}
      {/snippet}
    </DialogPrimitive.Popup>
  </DialogViewport>
</DialogPrimitive.Portal>
