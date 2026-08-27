<script lang="ts">
import { ContextMenu as P } from "@shardsui/svelte";
import { untrack } from "svelte";
import type { ContextMenuSubProps } from "./context-menu.types.js";
import ContextMenuIdProvider from "./context-menu-id-provider.svelte";

let { children: child, defaultOpen, open = $bindable(), ...props }: ContextMenuSubProps = $props();
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
<P.SubmenuRoot bind:open={getOpen, setOpen} {...props}>
  {#snippet children()}
    <ContextMenuIdProvider defaultPopupId={`${generatedId}-popup`} open={getOpen} bind:popupId>
      {@render child?.()}
    </ContextMenuIdProvider>
  {/snippet}
</P.SubmenuRoot>
