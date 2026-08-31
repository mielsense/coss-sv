<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "command", "kbd"],
    id: "p-command-1",
    interactive: true,
    responsive: true,
    title: "Command palette with dialog",
  });
</script>

<script lang="ts">
  import { buttonVariants, Command, HugeiconsIcon, Kbd, KbdGroup } from "@coss-sv/ui";
  import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
  import ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";
  import CornerDownLeftIcon from "@hugeicons/core-free-icons/CornerDownLeftIcon";

  type Item = { value: string; label: string; shortcut?: string };
  type Group = { value: string; items: Item[] };
  const suggestions: Item[] = [
    { label: "Linear", shortcut: "⌘L", value: "linear" },
    { label: "Figma", shortcut: "⌘F", value: "figma" },
    { label: "Slack", shortcut: "⌘S", value: "slack" },
    { label: "YouTube", shortcut: "⌘Y", value: "youtube" },
    { label: "Raycast", shortcut: "⌘R", value: "raycast" },
  ];
  const commands: Item[] = [
    { label: "Clipboard History", shortcut: "⌘⇧C", value: "clipboard-history" },
    { label: "Import Extension", shortcut: "⌘I", value: "import-extension" },
    { label: "Create Snippet", shortcut: "⌘N", value: "create-snippet" },
    { label: "System Preferences", shortcut: "⌘,", value: "system-preferences" },
    { label: "Window Management", shortcut: "⌘⇧W", value: "window-management" },
  ];
  const groups: Group[] = [
    { items: suggestions, value: "Suggestions" },
    { items: commands, value: "Commands" },
  ];
  let dialogOpen = $state(false);
  $effect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        dialogOpen = !dialogOpen;
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  });
</script>

<Command.DialogRoot bind:open={dialogOpen}>
  <Command.DialogTrigger class={buttonVariants({ variant: "outline" })}>
    Open Command Palette <KbdGroup><Kbd>⌘</Kbd><Kbd>J</Kbd></KbdGroup>
  </Command.DialogTrigger>
  <Command.DialogPopup>
    <Command.Root items={groups}>
      <Command.Input placeholder="Search for apps and commands..." /><Command.Panel>
        <Command.Empty>No results found.</Command.Empty><Command.List>
          {#each groups as group (group.value)}<Command.Group items={group.items}>
              <Command.GroupLabel>{group.value}</Command.GroupLabel><Command.Collection>
                {#snippet children(item: Item)}<Command.Item
                    onclick={() => (dialogOpen = false)}
                    value={item.value}
                  >
                    <span class="flex-1">{item.label}</span>
                    {#if item.shortcut}<Command.Shortcut>{item.shortcut}</Command.Shortcut>{/if}
                  </Command.Item>{/snippet}
              </Command.Collection>
            </Command.Group><Command.Separator />{/each}
        </Command.List>
      </Command.Panel><Command.Footer>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <KbdGroup>
              <Kbd>
                <HugeiconsIcon aria-hidden="true" icon={ArrowUp01Icon} strokeWidth={2} />
              </Kbd><Kbd>
                <HugeiconsIcon aria-hidden="true" icon={ArrowDown01Icon} strokeWidth={2} />
              </Kbd>
            </KbdGroup>
            <span>Navigate</span>
          </div>
          <div class="flex items-center gap-2">
            <Kbd>
              <HugeiconsIcon aria-hidden="true" icon={CornerDownLeftIcon} strokeWidth={2} />
            </Kbd>
            <span>Open</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Kbd>Esc</Kbd>
          <span>Close</span>
        </div>
      </Command.Footer>
    </Command.Root>
  </Command.DialogPopup>
</Command.DialogRoot>
