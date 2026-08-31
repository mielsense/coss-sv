<script module lang="ts">
  import type { Combobox as ShardsCombobox } from "@shardsui/svelte/combobox";
  import type { ComponentProps } from "svelte";
  export type ComboboxTriggerProps = ComponentProps<typeof ShardsCombobox.Trigger>;
</script>

<script lang="ts">
  import { Combobox as C } from "@shardsui/svelte/combobox";
  import { getSelectionChangeContext } from "@/selection-change-context.js";

  let {
    children: child,
    onclick,
    onkeydown,
    ref = $bindable(null),
    ...props
  }: ComboboxTriggerProps = $props();
  const change = getSelectionChangeContext();

  function handleClick(event: Parameters<NonNullable<ComboboxTriggerProps["onclick"]>>[0]): void {
    change?.prepare("trigger-press", event);
    onclick?.(event);
  }

  function handleKeydown(
    event: Parameters<NonNullable<ComboboxTriggerProps["onkeydown"]>>[0],
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
  <C.Trigger
    bind:ref
    data-slot="combobox-trigger"
    onclick={handleClick}
    onkeydown={handleKeydown}
    {...props}
  >
    {#snippet children(state)}
      {@render child(state)}
    {/snippet}
  </C.Trigger>
{:else}
  <C.Trigger
    bind:ref
    data-slot="combobox-trigger"
    onclick={handleClick}
    onkeydown={handleKeydown}
    {...props}
  />
{/if}
