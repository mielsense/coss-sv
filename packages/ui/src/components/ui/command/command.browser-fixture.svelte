<script lang="ts">
  import * as Command from "./index.js";
  const groups = [
    { value: "Suggestions", items: ["Linear", "Figma", "Slack"] },
    { value: "Commands", items: ["Clipboard History", "Create Snippet"] },
  ];
  let dialogOpen = $state(false);
  let chosen = $state("");
</script>

<Command.DialogRoot bind:open={dialogOpen}>
  <Command.DialogTrigger>Open Command Palette</Command.DialogTrigger>
  <Command.DialogPopup aria-label="Command palette">
    <Command.Root items={groups as unknown[]}>
      <Command.Input aria-label="Search commands" placeholder="Search for apps and commands..." />
      <Command.Panel class="">
        <Command.Empty>No results found.</Command.Empty>
        <Command.List>
          <Command.Collection>
            {#snippet children(group: { value: string; items: string[] })}
              <Command.Group items={group.items}>
                <Command.GroupLabel>{group.value}</Command.GroupLabel>
                <Command.Collection>
                  {#snippet children(item: string)}
                    <Command.Item
                      class=""
                      onclick={() => {
                        chosen = item;
                        dialogOpen = false;
                      }}
                      value={item}>{item}</Command.Item
                    >
                  {/snippet}
                </Command.Collection>
              </Command.Group>
              <Command.Separator class="" />
            {/snippet}
          </Command.Collection>
        </Command.List>
      </Command.Panel>
      <Command.Footer>Navigate</Command.Footer>
    </Command.Root>
  </Command.DialogPopup>
</Command.DialogRoot>
<output data-testid="command-value">{chosen}</output>
