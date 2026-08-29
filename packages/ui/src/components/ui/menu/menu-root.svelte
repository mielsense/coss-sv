<script lang="ts" generics="Payload = unknown">
  import { Menu as MenuPrimitive } from "@shardsui/svelte";
  import { untrack } from "svelte";
  import type { MenuRootProps } from "./menu.types.js";

  let {
    children: child,
    defaultOpen,
    open = $bindable(),
    triggerId = $bindable(null),
    ...props
  }: MenuRootProps<Payload> = $props();

  const initialOpen = untrack(() => defaultOpen ?? false);

  function getOpen(): boolean {
    return open ?? initialOpen;
  }

  function setOpen(next: boolean): void {
    open = next;
  }
</script>

<MenuPrimitive.Root bind:open={getOpen, setOpen} bind:triggerId {...props}>
  {#snippet children(state)}
    {@render child?.(state)}
  {/snippet}
</MenuPrimitive.Root>
