<script lang="ts">
import { ContextMenu as ContextMenuPrimitive } from "@shardsui/svelte";
import type { ContextMenuTriggerProps } from "./context-menu.types.js";
import { getContextMenuIdContext } from "./id-context.svelte.js";

let {
  "aria-controls": ariaControls,
  onkeydown,
  ref = $bindable(null),
  ...props
}: ContextMenuTriggerProps = $props();
const menuIds = getContextMenuIdContext();
const resolvedControls = $derived(ariaControls ?? (menuIds.open ? menuIds.popupId : undefined));

function openFromKeyboard(
  event: Parameters<NonNullable<ContextMenuTriggerProps["onkeydown"]>>[0],
): void {
  onkeydown?.(event);
  if (
    event.defaultPrevented ||
    (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10"))
  ) {
    return;
  }
  event.preventDefault();
  const bounds = ref?.getBoundingClientRect();
  ref?.dispatchEvent(
    new MouseEvent("contextmenu", {
      bubbles: true,
      button: 2,
      clientX: bounds ? bounds.left + bounds.width / 2 : 0,
      clientY: bounds ? bounds.top + bounds.height / 2 : 0,
    }),
  );
}
</script>

<ContextMenuPrimitive.Trigger
  aria-controls={resolvedControls}
  bind:ref
  data-slot="context-menu-trigger"
  onkeydown={openFromKeyboard}
  {...props}
/>
