<script module lang="ts">
  import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type AutocompleteClearProps = ComponentProps<typeof ShardsAutocomplete.Clear>;
</script>

<script lang="ts">
  import { Cancel01Icon } from "@hugeicons/core-free-icons";
  import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte";
  import HugeiconsIcon from "$lib/hugeicons-icon.svelte";
  import { cn } from "$lib/utils.js";

  let {
    "aria-label": ariaLabel = "Clear",
    class: className,
    children: child,
    ref = $bindable(null),
    ...props
  }: AutocompleteClearProps = $props();
</script>

<AutocompletePrimitive.Clear
  bind:ref
  aria-label={ariaLabel}
  class={cn(
    "absolute end-0.5 top-1/2 inline-flex size-8 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-[color,background-color,box-shadow,opacity] pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    className,
  )}
  data-slot="autocomplete-clear"
  {...props}
>
  {#snippet children(state)}
    {#if child}
      {@render child(state)}
    {:else}
      <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
    {/if}
  {/snippet}
</AutocompletePrimitive.Clear>
