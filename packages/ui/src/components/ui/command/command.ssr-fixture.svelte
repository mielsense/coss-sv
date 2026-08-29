<script lang="ts">
  import * as Command from "./index.js";

  const items = ["Linear", "Figma"];
</script>

<Command.Root {items}
  ><Command.Input placeholder="Search…" />
  <Command.Panel
    ><Command.Empty>No results found.</Command.Empty><Command.List
      ><Command.Collection
        >{#snippet children(item)}
          <Command.Item value={item}>{item}</Command.Item>
        {/snippet}</Command.Collection
      ></Command.List
    ></Command.Panel
  ><Command.Footer><Command.Shortcut>⌘K</Command.Shortcut></Command.Footer></Command.Root
>

<Command.Root {items}>
  <Command.Group class="consumer-group" data-testid="command-group" {items}>
    <Command.GroupLabel class="consumer-label" data-testid="command-group-label">
      Suggestions
    </Command.GroupLabel>
  </Command.Group>
</Command.Root>
