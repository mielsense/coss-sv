<script module lang="ts">
import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ContextMenuRootProps = Omit<ComponentProps<typeof ShardsContextMenu.Root>, "open"> & {
  defaultOpen?: boolean;
  open?: boolean;
};
</script>

<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";
import { setMenuIdContext } from "../menu/id-context.js";

let { defaultOpen, open = $bindable(), ...props }: ContextMenuRootProps = $props();
const initialOpen = untrack(() => defaultOpen ?? false);
const generatedId = $props.id();
function getOpen(): boolean {
  return open ?? initialOpen;
}
function setOpen(next: boolean): void {
  open = next;
}

setMenuIdContext({
  get open() {
    return getOpen();
  },
  popupId: `${generatedId}-popup`,
});
</script>

<ContextMenuPrimitive.Root bind:open={getOpen, setOpen} {...props} />
