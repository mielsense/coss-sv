<script lang="ts">
import { ContextMenu as P } from "@shardsui/svelte";
import { untrack } from "svelte";
import type { ContextMenuSubProps } from "./context-menu.types.js";
import { ContextMenuIdState, setContextMenuIdContext } from "./id-context.svelte.js";

let { defaultOpen, open = $bindable(), ...props }: ContextMenuSubProps = $props();
const initialOpen = untrack(() => defaultOpen ?? false);
const generatedId = $props.id();
function getOpen(): boolean {
  return open ?? initialOpen;
}
function setOpen(next: boolean): void {
  open = next;
}

setContextMenuIdContext(new ContextMenuIdState(getOpen, `${generatedId}-popup`));
</script>
<P.SubmenuRoot bind:open={getOpen, setOpen} {...props} />
