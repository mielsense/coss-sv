<script lang="ts">
  import * as Command from "./index.js";
  const items = ["Alpha"];

  let input = $state<HTMLInputElement | null>(null);
  let list = $state<HTMLElement | null>(null);
  let panel = $state<HTMLElement | null>(null);
  let footer = $state<HTMLElement | null>(null);
  let shortcut = $state<HTMLElement | null>(null);
  let visible = $state(true);
</script>

{#if visible}
  <Command.Root {items}>
    <Command.Input aria-label="Search commands" bind:ref={input} />
    <Command.Panel bind:ref={panel}>
      <Command.List bind:ref={list}>
        <Command.Item value="Alpha">Alpha</Command.Item>
      </Command.List>
    </Command.Panel>
    <Command.Footer bind:ref={footer}>
      <Command.Shortcut bind:ref={shortcut}>Enter</Command.Shortcut>
    </Command.Footer>
  </Command.Root>
{/if}
<button type="button" onclick={() => input?.focus()}>Focus search</button>
<button type="button" onclick={() => (visible = false)}>Remove command</button>
<output data-testid="ref-tags"
  >{[input, list, panel, footer, shortcut].map((node) => node?.tagName ?? "null").join(",")}</output
>
