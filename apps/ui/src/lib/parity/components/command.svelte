<script lang="ts">
import {
  Button,
  EmptyMedia,
  Input,
  Kbd,
  KbdGroup,
  ScrollArea,
  Skeleton,
  Spinner,
  buttonVariants,
} from "@coss-sv/ui";
import * as Command from "../../../../../../packages/ui/dist/components/ui/command/index.js";

type Item = { keywords?: string[]; label: string; shortcut?: string; value: string };
type Group = { items: Item[]; value: string };

const groupedItems: Group[] = [
  {
    items: [
      { label: "Linear", shortcut: "⌘L", value: "linear" },
      { label: "Figma", shortcut: "⌘F", value: "figma" },
      { label: "Slack", shortcut: "⌘S", value: "slack" },
      { label: "YouTube", shortcut: "⌘Y", value: "youtube" },
      { label: "Raycast", shortcut: "⌘R", value: "raycast" },
    ],
    value: "Suggestions",
  },
  {
    items: [
      { label: "Clipboard History", shortcut: "⌘⇧C", value: "clipboard-history" },
      { label: "Import Extension", shortcut: "⌘I", value: "import-extension" },
      { label: "Create Snippet", shortcut: "⌘N", value: "create-snippet" },
      { label: "System Preferences", shortcut: "⌘,", value: "system-preferences" },
      { label: "Window Management", shortcut: "⌘⇧W", value: "window-management" },
    ],
    value: "Commands",
  },
];
const commandGroups: Group[] = [
  {
    items: [
      { keywords: ["dash"], label: "Dashboard", shortcut: "d", value: "dashboard" },
      { keywords: ["proj"], label: "Projects", shortcut: "p", value: "projects" },
      { keywords: ["team"], label: "Team", shortcut: "t", value: "team" },
    ],
    value: "Pages",
  },
  {
    items: [
      { keywords: ["prof"], label: "Profile", shortcut: "p s", value: "profile" },
      { keywords: ["acc"], label: "Account", shortcut: "a s", value: "account" },
      { keywords: ["pref"], label: "Preferences", shortcut: "p r", value: "preferences" },
    ],
    value: "Settings",
  },
  {
    items: [
      { keywords: ["docs"], label: "Documentation", shortcut: "d o", value: "docs" },
      { keywords: ["sup"], label: "Support", shortcut: "s u", value: "support" },
      { keywords: ["feed"], label: "Feedback", shortcut: "f b", value: "feedback" },
    ],
    value: "Help",
  },
];
const response = `To create a new project, navigate to the Projects page and click the "New Project" button in the top right corner. You'll be prompted to enter a project name and description.

Once created, you can invite team members by clicking the "Share" button and entering their email addresses. Team members will receive an invitation link via email or you can add them manually by clicking the "Add Team Member" button in the project settings.

You can customize project settings at any time by clicking the settings icon in the project header. For more information, see the Project Settings documentation.`;
const references = [
  { href: "/docs/projects/create", label: "Creating Projects" },
  { href: "/docs/team/collaborate", label: "Team Collaboration" },
  { href: "/docs/projects/settings", label: "Project Settings" },
];

let paletteOpen = $state(false);
let aiOpen = $state(false);
let aiMode = $state(false);
let searchQuery = $state("");
let aiQuery = $state("");
let submittedQuery = $state("");
let generatedResponse = $state("");
let generating = $state(false);

const hasResults = $derived(
  !searchQuery.trim() ||
    commandGroups.some((group) =>
      group.items.some((item) =>
        [item.label, item.value, ...(item.keywords ?? [])].some((text) =>
          text.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      ),
    ),
);

function filterItem(itemValue: unknown, query: string): boolean {
  if (typeof itemValue !== "object" || itemValue === null) return false;
  const item = itemValue as Item;
  return [item.label, item.value, ...(item.keywords ?? [])].some((text) =>
    text.toLowerCase().includes(query.toLowerCase()),
  );
}

function resetAI(): void {
  aiMode = false;
  aiQuery = "";
  submittedQuery = "";
  generatedResponse = "";
  generating = false;
}

async function askAI(query = searchQuery): Promise<void> {
  if (!query.trim()) {
    aiMode = true;
    return;
  }
  aiMode = true;
  searchQuery = "";
  submittedQuery = query;
  aiQuery = "";
  generatedResponse = "";
  generating = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  generatedResponse = response;
  generating = false;
}

function closeAI(): void {
  aiOpen = false;
  searchQuery = "";
  resetAI();
}

function onWindowKeydown(event: KeyboardEvent): void {
  if (event.key.toLowerCase() === "j" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    paletteOpen = !paletteOpen;
  }
  if (aiOpen && aiMode && event.key === "Escape") {
    event.preventDefault();
    resetAI();
  }
}
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#snippet commandGroupsList(close: () => void)}
  <Command.List>
    <Command.Collection>
      {#snippet children(group: Group)}
        <Command.Group items={group.items}>
          <Command.GroupLabel>{group.value}</Command.GroupLabel>
          <Command.Collection>
            {#snippet children(item: Item)}
              <Command.Item onclick={close} value={item}>
                <span class="flex-1">{item.label}</span>
                {#if item.shortcut}
                  <Command.Shortcut>{item.shortcut}</Command.Shortcut>
                {/if}
              </Command.Item>
            {/snippet}
          </Command.Collection>
        </Command.Group>
        <Command.Separator />
      {/snippet}
    </Command.Collection>
  </Command.List>
{/snippet}

{#snippet footer(hasItems = true)}
  <Command.Footer>
    {#if hasItems}
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <KbdGroup><Kbd>↑</Kbd><Kbd>↓</Kbd></KbdGroup><span>Navigate</span>
        </div>
        <div class="flex items-center gap-2"><Kbd>↵</Kbd><span>Open</span></div>
      </div>
    {/if}
    <div class="ms-auto flex items-center gap-2"><Kbd>Esc</Kbd><span>Close</span></div>
  </Command.Footer>
{/snippet}

<div class="fixture">
  <section data-particle="p-command-1">
    <Command.DialogRoot bind:open={paletteOpen}>
      <Command.DialogTrigger
        class="inline-flex h-9 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm shadow-xs"
        >Open Command Palette <KbdGroup><Kbd>⌘</Kbd><Kbd>J</Kbd></KbdGroup></Command.DialogTrigger
      >
      <Command.DialogPopup>
        <Command.Root items={groupedItems}>
          <Command.Input placeholder="Search for apps and commands..." />
          <Command.Panel
            ><Command.Empty>No results found.</Command.Empty>
            {@render commandGroupsList(() => (paletteOpen = false))}</Command.Panel
          >
          {@render footer()}
        </Command.Root>
      </Command.DialogPopup>
    </Command.DialogRoot>
  </section>

  <section data-particle="p-command-2">
    <Button onclick={() => (aiOpen = true)} variant="outline">Cmdk with AI</Button>
    <Command.DialogRoot bind:open={aiOpen} onOpenChange={(open: boolean) => !open && closeAI()}>
      <Command.DialogPopup>
        {#if !aiMode}
          <Command.Root filter={filterItem} items={commandGroups}>
            <div class="relative flex items-center *:first:flex-1">
              <Command.Input
                oninput={(event: Event & { currentTarget: HTMLInputElement }) => (searchQuery = event.currentTarget.value)}
                onkeydown={(event: KeyboardEvent) => { if (event.key === "Tab" || (event.key === "Enter" && !hasResults && searchQuery.trim())) { event.preventDefault(); askAI(); } }}
                placeholder="Type a command or search..."
                value={searchQuery}
              />
              <Button
                class="me-2.5 rounded-md not-hover:text-muted-foreground text-sm sm:text-xs"
                onclick={() => askAI()}
                size="sm"
                variant="ghost"
                ><span aria-hidden="true">✦</span>Ask AI<Kbd class="ms-0.5 -me-1.5"
                  >Tab</Kbd
                ></Button
              >
            </div>
            <Command.Panel>
              <Command.Empty class="not-empty:py-12"
                >{#if searchQuery.trim()}
                  <div class="wrap-break-word flex flex-col items-center gap-2">
                    <EmptyMedia variant="icon">⌕</EmptyMedia>
                    <p>No results found.</p>
                    <p>
                      Press <Kbd>Enter</Kbd> to ask AI about:<br>
                      <strong class="font-medium text-foreground">{searchQuery}</strong>
                    </p>
                  </div>
                {/if}</Command.Empty
              >
              {@render commandGroupsList(closeAI)}
            </Command.Panel>
            {@render footer(hasResults)}
          </Command.Root>
        {:else}
          <Command.Root>
            <div class="flex items-center *:first:flex-1">
              <div class="px-2.5 py-1.5">
                <Input
                  aria-label="AI query input"
                  bind:value={aiQuery}
                  disabled={generating}
                  onkeydown={(event: KeyboardEvent) => { if (event.key === "Enter" && !generating) askAI(aiQuery); if (event.key === "Escape") { event.preventDefault(); resetAI(); } }}
                  placeholder="Ask AI anything…"
                  size="lg"
                />
              </div>
              <Button
                class="me-2.5 rounded-md text-sm sm:text-xs"
                onclick={resetAI}
                size="sm"
                variant="ghost"
                >← Back to search <Kbd class="ms-0.5 -me-1.5">Esc</Kbd></Button
              >
            </div>
            <Command.Panel
              ><ScrollArea overscrollContain scrollbarGutter scrollFade
                ><div class="p-5">
                  {#if !generating && !generatedResponse}
                    <div class="flex items-center justify-center py-12">
                      <p class="text-muted-foreground text-sm">
                        Ask AI anything and press <Kbd>Enter</Kbd> to get started.
                      </p>
                    </div>
                  {/if}
                  {#if generating}
                    <div class="flex flex-col gap-4">
                      {#each ["full", "full", "full", "half", "full", "full", "three"] as width}
                        <Skeleton
                          class={width === "half" ? "h-4 w-1/2" : width === "three" ? "h-4 w-3/4" : "h-4 w-full"}
                        />
                      {/each}
                    </div>
                  {/if}
                  {#if generatedResponse}
                    <div aria-live="polite" class="text-muted-foreground text-sm">
                      {#each generatedResponse.split("\n\n") as paragraph}
                        <p class="not-first:mt-3 leading-relaxed">{paragraph}</p>
                      {/each}
                    </div>
                    <div class="mt-4 flex flex-wrap gap-2">
                      {#each references as reference}
                        <a
                          class={buttonVariants({ size: "sm", variant: "secondary" })}
                          href={reference.href}
                          >{reference.label}</a
                        >
                      {/each}
                    </div>
                  {/if}
                </div></ScrollArea
              ></Command.Panel
            >
            <Command.Footer
              >{#if generating}
                <div aria-live="polite" class="flex items-center gap-2">
                  <Spinner class="size-3" /><span class="animate-pulse">Generating response…</span>
                </div>
              {:else if generatedResponse}
                <div class="flex items-center gap-2">
                  <span aria-hidden="true">?</span>You asked: <span>"{submittedQuery}"</span>
                </div>
              {:else}
                <div class="flex items-center gap-2"><Kbd>↵</Kbd><span>Ask AI</span></div>
              {/if}</Command.Footer
            >
          </Command.Root>
        {/if}
      </Command.DialogPopup>
    </Command.DialogRoot>
  </section>
</div>

<style>
.fixture {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 3rem 2rem;
  padding: 2rem;
}
.fixture section {
  display: flex;
  width: 100%;
  max-width: 16rem;
  min-width: 0;
  align-items: center;
  justify-self: center;
  justify-content: center;
}
@media (max-width: 639px) {
  .fixture {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    padding: 1.5rem;
  }
}
</style>
