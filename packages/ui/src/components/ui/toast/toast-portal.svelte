<script module lang="ts">
import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";

type Props = {
  children?: Snippet;
  container?: HTMLElement | null;
  dataSlot: "toast-portal" | "toast-portal-anchored";
  ref?: HTMLDivElement | null;
};

const portalOrigins = new WeakMap<Element, Element>();

function portalTo(container: HTMLElement | null | undefined): Attachment {
  return (node) => {
    const origin = portalOrigins.get(node) ?? node.parentElement;
    const target =
      container ?? origin?.closest("[data-shards-ui-portal]") ?? node.ownerDocument.body;
    if (origin) portalOrigins.set(node, origin);
    target.appendChild(node);
    return () => node.remove();
  };
}
</script>

<script lang="ts">
let { children, container, dataSlot, ref = $bindable(null) }: Props = $props();
</script>

<div bind:this={ref} {@attach portalTo(container)} data-shards-ui-portal="" data-slot={dataSlot}>
  {@render children?.()}
</div>
