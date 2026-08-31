<script module lang="ts">
  import type { Dialog as ShardsDialog } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";
  export type CommandDialogPopupProps = ComponentProps<typeof ShardsDialog.Popup> & {
    portalProps?: ComponentProps<typeof ShardsDialog.Portal>;
  };
</script>

<script lang="ts">
  import { Dialog as D } from "@shardsui/svelte/dialog";
  import { cn } from "@/utils.js";
  import Backdrop from "./command-dialog-backdrop.svelte";
  import Viewport from "./command-dialog-viewport.svelte";
  let {
    children: child,
    class: className,
    portalProps = {},
    ref = $bindable(null),
    ...props
  }: CommandDialogPopupProps = $props();
</script>

<D.Portal {...portalProps}
  ><Backdrop />
  <Viewport
    ><D.Popup
      bind:ref
      class={cn(
        "relative row-start-2 flex max-h-105 min-h-0 w-full min-w-0 max-w-xl -translate-y-[calc(1.25rem*var(--nested-dialogs))] scale-[calc(1-0.1*var(--nested-dialogs))] flex-col rounded-2xl border bg-popover not-dark:bg-clip-padding text-popover-foreground opacity-[calc(1-0.1*var(--nested-dialogs))] shadow-lg/5 outline-none transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:bg-muted/72 before:shadow-[0_1px_--theme(--color-black/4%)] data-nested:data-ending-style:translate-y-8 data-nested:data-starting-style:translate-y-8 data-nested-dialog-open:origin-top data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 **:data-[slot=scroll-area-viewport]:data-has-overflow-y:pe-1 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
      data-slot="command-dialog-popup"
      {...props}
      >{#snippet children(state)}
        {@render child?.(state)}
      {/snippet}</D.Popup
    ></Viewport
  ></D.Portal
>
