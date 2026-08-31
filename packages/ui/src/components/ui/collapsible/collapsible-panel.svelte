<script module lang="ts">
  import type { Collapsible as ShardsCollapsible } from "@shardsui/svelte/collapsible";
  import type { ComponentProps } from "svelte";

  export type CollapsiblePanelProps = ComponentProps<typeof ShardsCollapsible.Panel>;
</script>

<script lang="ts">
  import { Collapsible as CollapsiblePrimitive } from "@shardsui/svelte/collapsible";
  import type { Attachment } from "svelte/attachments";
  import { createAttachmentKey } from "svelte/attachments";
  import { cn } from "@/utils.js";
  import { getCollapsibleDelegateContext } from "./context.js";

  const uid = $props.id();

  let {
    class: className,
    id = uid,
    ref = $bindable(null),
    ...props
  }: CollapsiblePanelProps = $props();

  const context = getCollapsibleDelegateContext();
  const registrationKey = createAttachmentKey();
  const registerPanelId: Attachment<HTMLElement> = () => context.registerPanelId(id);
  const registrationProps = $derived({ [registrationKey]: registerPanelId });
</script>

<CollapsiblePrimitive.Panel
  bind:ref
  class={cn(
    "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0",
    className,
  )}
  data-slot="collapsible-panel"
  {id}
  {...registrationProps}
  {...props}
/>
