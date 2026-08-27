<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";
import type { ContextMenuRootProps } from "./context-menu.types.js";
import { ContextMenuIdState, setContextMenuIdContext } from "./id-context.svelte.js";

let { defaultOpen, open = $bindable(), ...props }: ContextMenuRootProps = $props();
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

<ContextMenuPrimitive.Root bind:open={getOpen, setOpen} {...props} />
