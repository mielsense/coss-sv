<script module lang="ts">
import type { Menu as ShardsMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type MenuSubProps = Omit<ComponentProps<typeof ShardsMenu.SubmenuRoot>, "open"> & {
  defaultOpen?: boolean;
  open?: boolean;
};
</script>

<script lang="ts">
import { Menu as MenuPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";
import { setMenuIdContext } from "./id-context.js";

let { defaultOpen, open = $bindable(), ...props }: MenuSubProps = $props();
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

<MenuPrimitive.SubmenuRoot bind:open={getOpen, setOpen} {...props} />
