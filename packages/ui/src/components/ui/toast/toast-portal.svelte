<script module lang="ts">
import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";
import type { ToastPortalContainer, ToastPortalProps, ToastPortalRef } from "./toast.types.js";

type Props = ToastPortalProps & {
  children?: Snippet;
  dataSlot: "toast-portal" | "toast-portal-anchored";
};

const portalOrigins = new WeakMap<Element, Element>();

function resolveContainer(
  container: ToastPortalContainer | undefined,
): HTMLElement | ShadowRoot | null | undefined {
  return container && "current" in container ? container.current : container;
}

function portalTo(container: ToastPortalContainer | undefined): Attachment {
  return (node) => {
    const origin = portalOrigins.get(node) ?? node.parentElement;
    const target =
      resolveContainer(container) ??
      origin?.closest("[data-shards-ui-portal]") ??
      node.ownerDocument.body;
    if (origin) portalOrigins.set(node, origin);
    target.appendChild(node);
    return () => node.remove();
  };
}

function assignPortalRef(ref: ToastPortalRef | undefined, node: HTMLDivElement): () => void {
  if (typeof ref === "function") {
    const cleanup = ref(node);
    return () => {
      if (cleanup) cleanup();
      else ref(null);
    };
  }

  if (ref) ref.current = node;
  return () => {
    if (ref?.current === node) ref.current = null;
  };
}
</script>

<script lang="ts">
let { children, container, dataSlot, ref, ...restProps }: Props = $props();
let portalNode = $state<HTMLDivElement | null>(null);

$effect(() => {
  if (!portalNode) return;
  return assignPortalRef(ref, portalNode);
});
</script>

<div
  bind:this={portalNode}
  {@attach portalTo(container)}
  data-shards-ui-portal=""
  data-slot={dataSlot}
  {...restProps}
>
  {@render children?.()}
</div>
