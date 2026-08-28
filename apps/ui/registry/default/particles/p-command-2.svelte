<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: [
      "autocomplete",
      "button",
      "command",
      "empty",
      "input",
      "kbd",
      "scroll-area",
      "skeleton",
      "spinner",
    ],
    id: "p-command-2",
    interactive: true,
    responsive: true,
    title: "Command palette with AI assistant",
  });
</script>

<script lang="ts">
  import { Button, Command, Empty, Input, Kbd, KbdGroup, Skeleton, Spinner } from "@coss-sv/ui";
  import {
    ArrowDown01Icon,
    ArrowLeft01Icon,
    ArrowUp01Icon,
    CornerDownLeftIcon,
    Search01Icon,
    SparklesIcon,
  } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  type Item = { value: string; label: string; shortcut?: string; keywords?: string[] };
  type Group = { value: string; items: Item[] };
  const groups: Group[] = [
    {
      value: "Pages",
      items: [
        { keywords: ["dash"], label: "Dashboard", shortcut: "d", value: "dashboard" },
        { keywords: ["proj"], label: "Projects", shortcut: "p", value: "projects" },
        { keywords: ["team"], label: "Team", shortcut: "t", value: "team" },
      ],
    },
    {
      value: "Settings",
      items: [
        { keywords: ["prof"], label: "Profile", shortcut: "p s", value: "profile" },
        { keywords: ["acc"], label: "Account", shortcut: "a s", value: "account" },
        { keywords: ["pref"], label: "Preferences", shortcut: "p r", value: "preferences" },
      ],
    },
    {
      value: "Help",
      items: [
        { keywords: ["docs"], label: "Documentation", shortcut: "d o", value: "docs" },
        { keywords: ["sup"], label: "Support", shortcut: "s u", value: "support" },
        { keywords: ["feed"], label: "Feedback", shortcut: "f b", value: "feedback" },
      ],
    },
  ];
  const responseParagraphs = [
    'To create a new project, navigate to the Projects page and click the "New Project" button in the top right corner. You\'ll be prompted to enter a project name and description.',
    'Once created, you can invite team members by clicking the "Share" button and entering their email addresses. Team members will receive an invitation link via email or you can add them manually by clicking the "Add Team Member" button in the project settings.',
    "You can customize project settings at any time by clicking the settings icon in the project header. For more information, see the Project Settings documentation.",
  ];
  const links = [
    { title: "Creating Projects", url: "/docs/projects/create" },
    { title: "Team Collaboration", url: "/docs/team/collaborate" },
    { title: "Project Settings", url: "/docs/projects/settings" },
  ];
  let dialogOpen = $state(false);
  let aiMode = $state(false);
  let query = $state("");
  let submitted = $state("");
  let generating = $state(false);
  let response = $state(false);
  let request = 0;
  const hasResults = $derived(
    !query.trim() ||
      groups.some((group) =>
        group.items.some((item) =>
          [item.label, item.value, ...(item.keywords ?? [])].some((value) =>
            value.toLowerCase().includes(query.toLowerCase()),
          ),
        ),
      ),
  );
  function back() {
    request += 1;
    aiMode = false;
    query = "";
    submitted = "";
    generating = false;
    response = false;
  }
  async function ask(value = query) {
    if (!value.trim()) {
      aiMode = true;
      return;
    }
    const current = ++request;
    submitted = value;
    query = "";
    aiMode = true;
    generating = true;
    response = false;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (current !== request) return;
    generating = false;
    response = true;
  }
  function close() {
    dialogOpen = false;
    back();
  }
</script>

<Button onclick={() => (dialogOpen = true)} variant="outline">Cmdk with AI</Button>
<Command.DialogRoot
  bind:open={dialogOpen}
  onOpenChange={(value) => {
    if (!value) back();
  }}
  ><Command.DialogPopup>
    {#if !aiMode}
      <Command.Root items={groups}
        ><div class="relative flex items-center *:first:flex-1">
          <Command.Input
            bind:value={query}
            onkeydown={(event) => {
              if (event.key === "Tab" || (event.key === "Enter" && !hasResults && query.trim())) {
                event.preventDefault();
                ask();
              }
            }}
            placeholder="Type a command or search..."
          /><Button
            class="me-2.5 rounded-md not-hover:text-muted-foreground text-sm sm:text-xs"
            onclick={() => ask()}
            size="sm"
            variant="ghost"
            ><HugeiconsIcon aria-hidden="true" icon={SparklesIcon} strokeWidth={2} />Ask AI<Kbd
              class="ms-0.5 -me-1.5">Tab</Kbd
            ></Button
          >
        </div>
        <Command.Panel
          ><Command.Empty class="not-empty:py-12"
            >{#if query.trim()}<div class="wrap-break-word flex flex-col items-center gap-2">
                <Empty.Media variant="icon"
                  ><HugeiconsIcon
                    aria-hidden="true"
                    icon={Search01Icon}
                    strokeWidth={2}
                  /></Empty.Media
                >
                <p>No results found.</p>
                <p>
                  Press <Kbd>Enter</Kbd> to ask AI about:<br /><strong
                    class="font-medium text-foreground">{query}</strong
                  >
                </p>
              </div>{/if}</Command.Empty
          ><Command.List
            >{#each groups as group (group.value)}<Command.Group items={group.items}
                ><Command.GroupLabel>{group.value}</Command.GroupLabel><Command.Collection
                  >{#snippet children(item: Item)}<Command.Item onclick={close} value={item}
                      ><span class="flex-1">{item.label}</span>{#if item.shortcut}<Command.Shortcut
                          >{item.shortcut}</Command.Shortcut
                        >{/if}</Command.Item
                    >{/snippet}</Command.Collection
                ></Command.Group
              ><Command.Separator />{/each}</Command.List
          ></Command.Panel
        >
        <Command.Footer
          >{#if hasResults}<div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <KbdGroup
                  ><Kbd
                    ><HugeiconsIcon aria-hidden="true" icon={ArrowUp01Icon} strokeWidth={2} /></Kbd
                  ><Kbd
                    ><HugeiconsIcon
                      aria-hidden="true"
                      icon={ArrowDown01Icon}
                      strokeWidth={2}
                    /></Kbd
                  ></KbdGroup
                ><span>Navigate</span>
              </div>
              <div class="flex items-center gap-2">
                <Kbd
                  ><HugeiconsIcon
                    aria-hidden="true"
                    icon={CornerDownLeftIcon}
                    strokeWidth={2}
                  /></Kbd
                ><span>Open</span>
              </div>
            </div>{/if}
          <div class="ms-auto flex items-center gap-2">
            <Kbd>Esc</Kbd><span>Close</span>
          </div></Command.Footer
        ></Command.Root
      >
    {:else}
      <Command.Root
        ><div class="flex items-center *:first:flex-1">
          <div class="px-2.5 py-1.5">
            <div class="relative w-full">
              <span
                class="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-3 opacity-80"
                ><HugeiconsIcon aria-hidden="true" icon={SparklesIcon} strokeWidth={2} /></span
              ><Input
                aria-label="AI query input"
                class="border-transparent! bg-transparent! shadow-none before:hidden *:data-[slot=input]:ps-8"
                disabled={generating}
                bind:value={query}
                onkeydown={(event) => {
                  if (event.key === "Enter" && !generating) ask();
                  if (event.key === "Escape") {
                    event.preventDefault();
                    back();
                  }
                }}
                placeholder="Ask AI anything…"
                size="lg"
              />
            </div>
          </div>
          <Button
            class="me-2.5 rounded-md not-hover:text-muted-foreground text-sm sm:text-xs"
            onclick={back}
            size="sm"
            variant="ghost"
            ><HugeiconsIcon aria-hidden="true" icon={ArrowLeft01Icon} strokeWidth={2} />Back to
            search<Kbd class="ms-0.5 -me-1.5">Esc</Kbd></Button
          >
        </div>
        <Command.Panel
          ><div class="p-5">
            {#if generating}<div class="flex flex-col gap-4">
                {#each [4, 3, 4] as lines, index (index)}<div class="flex flex-col gap-2">
                    {#each Array(lines) as _}<Skeleton class="h-4 w-full" />{/each}
                  </div>{/each}
              </div>{:else if response}<div
                aria-live="polite"
                class="text-muted-foreground text-sm"
              >
                {#each responseParagraphs as paragraph}<p class="not-first:mt-3 leading-relaxed">
                    {paragraph}
                  </p>{/each}
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                {#each links as link (link.url)}<Button
                    href={link.url}
                    size="sm"
                    variant="secondary">{link.title}</Button
                  >{/each}
              </div>{:else}<div class="flex items-center justify-center py-12">
                <p class="text-muted-foreground text-sm">
                  Ask AI anything and press <Kbd>Enter</Kbd> to get started.
                </p>
              </div>{/if}
          </div></Command.Panel
        >
        <Command.Footer
          >{#if generating}<div aria-live="polite" class="flex items-center gap-2">
              <Spinner class="size-3" /><span class="animate-pulse">Generating response…</span>
            </div>{:else if response}<div class="flex items-center gap-2">
              You asked: <span>"{submitted}"</span>
            </div>{:else}<div class="flex items-center gap-2">
              <Kbd
                ><HugeiconsIcon aria-hidden="true" icon={CornerDownLeftIcon} strokeWidth={2} /></Kbd
              ><span>Ask AI</span>
            </div>{/if}</Command.Footer
        ></Command.Root
      >
    {/if}
  </Command.DialogPopup></Command.DialogRoot
>
