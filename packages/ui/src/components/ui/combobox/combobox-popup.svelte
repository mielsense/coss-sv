<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  type P = ComponentProps<typeof ShardsCombobox.Positioner>;
  export type ComboboxPopupProps = ComponentProps<typeof ShardsCombobox.Popup> & {
    align?: P["align"];
    alignOffset?: P["alignOffset"];
    anchor?: P["anchor"];
    portalProps?: ComponentProps<typeof ShardsCombobox.Portal>;
    side?: P["side"];
    sideOffset?: P["sideOffset"];
  };
</script>

<script lang="ts">
  import { Combobox as C } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  import { getComboboxWrapperContext } from "./context.svelte.js";
  let {
    align = "start",
    alignOffset,
    anchor: anchorProp,
    children: child,
    class: className,
    portalProps = {},
    ref = $bindable(null),
    side = "bottom",
    sideOffset = 4,
    ...props
  }: ComboboxPopupProps = $props();
  const context = getComboboxWrapperContext();
  const anchor = $derived(anchorProp ?? context.chipsRef ?? undefined);
  const alignOffsetProps = $derived(alignOffset === undefined ? {} : { alignOffset });
  const anchorProps = $derived(anchor === undefined ? {} : { anchor });
</script>

<C.Portal {...portalProps}
  ><C.Positioner
    {align}
    {...alignOffsetProps}
    {...anchorProps}
    class="z-50 select-none"
    data-slot="combobox-positioner"
    {side}
    {sideOffset}
    ><span
      class={cn(
        "relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
      ><C.Popup
        bind:ref
        class="flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col text-foreground"
        data-slot="combobox-popup"
        {...props}
        >{#snippet children(state)}
          {@render child?.(state)}
        {/snippet}</C.Popup
      ></span
    ></C.Positioner
  ></C.Portal
>
