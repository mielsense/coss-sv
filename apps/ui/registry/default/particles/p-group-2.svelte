<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "group", "input", "tooltip"],
    id: "p-group-2",
    interactive: true,
    responsive: false,
    title: "Group with input",
  });
</script>

<script lang="ts">
  import { buttonVariants, Group, HugeiconsIcon, Input, Tooltip } from "@coss-sv/ui";
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

<Group.Root aria-label="Url input">
  <Input aria-label="Url" bind:ref={input} value="https://coss.com" type="text" />
  <Group.Separator />
  <Tooltip.Root>
    <Tooltip.Trigger
      aria-label="Copy"
      class={buttonVariants({ size: "icon", variant: "outline" })}
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
</Group.Root>
