<script module lang="ts">
  import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte/autocomplete";
  import type { ComponentProps } from "svelte";
  type PositionerProps = ComponentProps<typeof ShardsAutocomplete.Positioner>;
  export type AutocompletePopupProps = ComponentProps<typeof ShardsAutocomplete.Popup> & {
    align?: PositionerProps["align"];
    alignOffset?: PositionerProps["alignOffset"];
    anchor?: PositionerProps["anchor"];
    portalProps?: ComponentProps<typeof ShardsAutocomplete.Portal>;
    side?: PositionerProps["side"];
    sideOffset?: PositionerProps["sideOffset"];
  };
</script>

<script lang="ts">
  import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte/autocomplete";
  import { cn } from "@/utils.js";
  let {
    align = "start",
    alignOffset,
    anchor,
    children: child,
    class: className,
    portalProps = {},
    ref = $bindable(null),
    side = "bottom",
    sideOffset = 4,
    ...props
  }: AutocompletePopupProps = $props();
  const alignOffsetProps = $derived(alignOffset === undefined ? {} : { alignOffset });
  const anchorProps = $derived(anchor === undefined ? {} : { anchor });
</script>

<AutocompletePrimitive.Portal {...portalProps}>
  <AutocompletePrimitive.Positioner
    {align}
    {...alignOffsetProps}
    {...anchorProps}
    class="z-50 select-none"
    data-slot="autocomplete-positioner"
    {side}
    {sideOffset}
  >
    <span
      class={cn(
        "relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
    >
      <AutocompletePrimitive.Popup
        bind:ref
        class="flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col text-foreground"
        data-slot="autocomplete-popup"
        {...props}
      >
        {#snippet children(state)}
          {@render child?.(state)}
        {/snippet}
      </AutocompletePrimitive.Popup>
    </span>
  </AutocompletePrimitive.Positioner>
</AutocompletePrimitive.Portal>
