<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "group", "input", "tooltip"],
  id: "p-group-2",
  interactive: true,
  responsive: false,
  title: "Group with input",
});
</script>

<script lang="ts">
import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { buttonVariants, Group, Input, Tooltip } from "@coss-sv/ui";

let input: HTMLInputElement | null = $state(null);
let isCopied = $state(false);

async function copy() {
  if (!input) return;
  await navigator.clipboard.writeText(input.value);
  isCopied = true;
  setTimeout(() => (isCopied = false), 1500);
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
      <HugeiconsIcon aria-hidden="true" icon={isCopied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
    </Tooltip.Trigger>
    <Tooltip.Popup><p>Copy to clipboard</p></Tooltip.Popup>
  </Tooltip.Root>
</Group.Root>
