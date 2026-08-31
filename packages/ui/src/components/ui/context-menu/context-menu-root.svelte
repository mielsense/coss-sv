<script lang="ts">
  import { ContextMenu as ContextMenuPrimitive } from "@shardsui/svelte/context-menu";
  import { untrack } from "svelte";
  import ContextMenuIdProvider from "./context-menu-id-provider.svelte";
  import type { ContextMenuRootProps } from "./context-menu.types.js";

  let {
    children: child,
    defaultOpen,
    open = $bindable(),
    ...props
  }: ContextMenuRootProps = $props();
  const initialOpen = untrack(() => defaultOpen ?? false);
  const generatedId = $props.id();
  let popupId = $state<string | undefined>();
  function getOpen(): boolean {
    return open ?? initialOpen;
  }
  function setOpen(next: boolean): void {
    open = next;
  }
</script>

<ContextMenuPrimitive.Root bind:open={getOpen, setOpen} {...props}>
  {#snippet children()}
    <ContextMenuIdProvider defaultPopupId={`${generatedId}-popup`} open={getOpen} bind:popupId>
      {@render child?.()}
    </ContextMenuIdProvider>
  {/snippet}
</ContextMenuPrimitive.Root>
