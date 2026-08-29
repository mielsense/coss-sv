<script lang="ts">
  import { Menu as MenuPrimitive } from "@shardsui/svelte";
  import { untrack } from "svelte";
  import type { MenuSubProps } from "./menu.types.js";

  let { defaultOpen, open = $bindable(), ...props }: MenuSubProps = $props();
  const initialOpen = untrack(() => defaultOpen ?? false);
  function getOpen(): boolean {
    return open ?? initialOpen;
  }
  function setOpen(next: boolean): void {
    open = next;
  }
</script>

<MenuPrimitive.SubmenuRoot bind:open={getOpen, setOpen} {...props} />
