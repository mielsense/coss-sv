<script module lang="ts">
  import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte/autocomplete";
  import type { ComponentProps } from "svelte";
  export type AutocompleteTriggerProps = ComponentProps<typeof ShardsAutocomplete.Trigger>;
</script>

<script lang="ts">
  import { Autocomplete as AutocompletePrimitive } from "@shardsui/svelte/autocomplete";
  import { getSelectionChangeContext } from "@/selection-change-context.js";

  let {
    children: child,
    onclick,
    onkeydown,
    ref = $bindable(null),
    ...props
  }: AutocompleteTriggerProps = $props();
  const change = getSelectionChangeContext();

  function handleClick(
    event: Parameters<NonNullable<AutocompleteTriggerProps["onclick"]>>[0],
  ): void {
    change?.prepare("trigger-press", event);
    onclick?.(event);
  }

  function handleKeydown(
    event: Parameters<NonNullable<AutocompleteTriggerProps["onkeydown"]>>[0],
  ): void {
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      change?.prepare("list-navigation", event);
    } else if (["Enter", " "].includes(event.key)) {
      change?.prepare("trigger-press", event);
    }
    onkeydown?.(event);
  }
</script>

{#if child}
  <AutocompletePrimitive.Trigger
    bind:ref
    data-slot="autocomplete-trigger"
    onclick={handleClick}
    onkeydown={handleKeydown}
    {...props}
  >
    {#snippet children(state)}
      {@render child(state)}
    {/snippet}
  </AutocompletePrimitive.Trigger>
{:else}
  <AutocompletePrimitive.Trigger
    bind:ref
    data-slot="autocomplete-trigger"
    onclick={handleClick}
    onkeydown={handleKeydown}
    {...props}
  />
{/if}
