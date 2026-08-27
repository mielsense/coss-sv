<script module lang="ts">
import type { ContextMenu as ShardsContextMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ContextMenuSubProps = Omit<
  ComponentProps<typeof ShardsContextMenu.SubmenuRoot>,
  "open"
> & { defaultOpen?: boolean; open?: boolean };
</script>
<script lang="ts">
import { ContextMenu as P } from "@shardsui/svelte";
import { untrack } from "svelte";
import { setMenuIdContext } from "../menu/id-context.js";

let { defaultOpen, open = $bindable(), ...props }: ContextMenuSubProps = $props();
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
<P.SubmenuRoot bind:open={getOpen, setOpen} {...props} />
