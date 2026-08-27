<script module lang="ts">
import type { Menu as ShardsMenu } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type MenuRootProps<Payload = unknown> = Omit<
  ComponentProps<typeof ShardsMenu.Root>,
  "open"
> & {
  defaultOpen?: boolean;
  open?: boolean;
};
</script>

<script lang="ts" generics="Payload = unknown">
import { Menu as MenuPrimitive } from "@shardsui/svelte";
import { untrack } from "svelte";
import { setMenuIdContext } from "./id-context.js";

let {
  defaultOpen,
  open = $bindable(),
  triggerId = $bindable(null),
  ...props
}: MenuRootProps<Payload> = $props();

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

<MenuPrimitive.Root bind:open={getOpen, setOpen} bind:triggerId {...props} />
