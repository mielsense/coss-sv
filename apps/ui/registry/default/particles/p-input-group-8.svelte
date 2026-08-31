<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "tooltip"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-8",
    interactive: true,
    responsive: false,
    title: "Input group with icon button",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, InputGroup, Tooltip } from "@coss-sv/ui";
  import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
  import Tick01Icon from "@hugeicons/core-free-icons/Tick01Icon";
  import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard.svelte.js";

  let input: HTMLInputElement | null = $state(null);
  const clipboard = useCopyToClipboard();
  function copy() {
    if (!input) return;
    clipboard.copyToClipboard(input.value);
  }
</script>

<InputGroup.Root>
  <InputGroup.Input aria-label="Url" bind:ref={input} value="https://coss.com" type="text" />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-label="Copy"
        class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
        onclick={copy}
      >
        <HugeiconsIcon
          aria-hidden="true"
          icon={clipboard.isCopied ? Tick01Icon : Copy01Icon}
          strokeWidth={2}
        />
      </Tooltip.Trigger>
      <Tooltip.Popup><p>Copy to clipboard</p></Tooltip.Popup>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
