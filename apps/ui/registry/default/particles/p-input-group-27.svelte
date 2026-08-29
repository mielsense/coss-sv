<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "select", "tooltip"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-80",
    id: "p-input-group-27",
    interactive: true,
    responsive: false,
    title: "Code snippet input with language selector",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, InputGroup, Select, Tooltip } from "@coss-sv/ui";
  import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";

  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
  ];
  let language = $state("javascript");
  let textarea: HTMLTextAreaElement | null = $state(null);
  let copied = $state(false);
  async function copy() {
    await navigator.clipboard.writeText(textarea?.value || "");
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<InputGroup.Root>
  <InputGroup.Textarea
    bind:ref={textarea}
    class="font-mono"
    placeholder="Paste your code here…"
    rows={6}
  />
  <InputGroup.Addon
    align="block-start"
    class="justify-between rounded-t-lg border-b bg-muted/72 p-2!"
  >
    <Select.Root bind:value={language} items={languages}>
      <Select.Trigger class="w-fit" size="sm"><Select.Value /></Select.Trigger>
      <Select.Popup
        >{#each languages as item (item.value)}
          <Select.Item value={item.value}>{item.label}</Select.Item>
        {/each}</Select.Popup
      >
    </Select.Root>
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-label={copied ? "Copied" : "Copy code"}
        class={buttonVariants({ size: "icon-sm", variant: "ghost" })}
        onclick={copy}
      >
        <HugeiconsIcon aria-hidden="true" icon={copied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
      </Tooltip.Trigger>
      <Tooltip.Popup>{copied ? "Copied!" : "Copy to clipboard"}</Tooltip.Popup>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
