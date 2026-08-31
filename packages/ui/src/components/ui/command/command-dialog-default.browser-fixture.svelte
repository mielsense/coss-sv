<script lang="ts">
  import * as Command from "./index.js";
</script>

<Command.DialogRoot defaultOpen>
  <Command.DialogPopup aria-label="Default command dialog">
    <Command.Root items={["Figma"]}>
      <Command.Input aria-label="Default command search" />
      <Command.List>
        <Command.Item value="Figma">Figma</Command.Item>
      </Command.List>
    </Command.Root>
  </Command.DialogPopup>
</Command.DialogRoot>
