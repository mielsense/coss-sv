<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
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
  import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";

  let input: HTMLInputElement | null = $state(null);
  let copied = $state(false);
  async function copy() {
    if (!input) return;
    await navigator.clipboard.writeText(input.value);
    copied = true;
    setTimeout(() => (copied = false), 1500);
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
        <HugeiconsIcon aria-hidden="true" icon={copied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
      </Tooltip.Trigger>
      <Tooltip.Popup><p>Copy to clipboard</p></Tooltip.Popup>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
