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
  import {
    Button,
    Command,
    EmptyMedia,
    HugeiconsIcon,
    Input,
    Kbd,
    KbdGroup,
    ScrollArea,
    Skeleton,
    Spinner,
  } from "@coss-sv/ui";
  import {
    ArrowDown01Icon,
    ArrowLeft01Icon,
    ArrowUp01Icon,
    CircleQuestionMarkIcon,
    CornerDownLeftIcon,
    Search01Icon,
    SparklesIcon,
  } from "@hugeicons/core-free-icons";
  import { onDestroy, tick } from "svelte";
  import type { Attachment } from "svelte/attachments";

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
  const mockAIResponse = `To create a new project, navigate to the Projects page and click the "New Project" button in the top right corner. You'll be prompted to enter a project name and description.

Once created, you can invite team members by clicking the "Share" button and entering their email addresses. Team members will receive an invitation link via email or you can add them manually by clicking the "Add Team Member" button in the project settings.

You can customize project settings at any time by clicking the settings icon in the project header. For more information, see the Project Settings documentation.`;
  const mockReferenceLinks = [
    { title: "Creating Projects", url: "/docs/projects/create" },
    { title: "Team Collaboration", url: "/docs/team/collaborate" },
    { title: "Project Settings", url: "/docs/projects/settings" },
  ];

  let dialogOpen = $state(false);
  let aiMode = $state(false);
  let aiQuery = $state("");
  let searchQuery = $state("");
  let submittedQuery = $state("");
  let generating = $state(false);
  let response = $state("");
  let error = $state<string | null>(null);
  let referenceLinks = $state<typeof mockReferenceLinks>([]);
  const uid = $props.id();
  const searchInputId = `${uid}-search-input`;
  const aiInputId = `${uid}-ai-input`;
  let searchInput = $state<HTMLInputElement | null>(null);
  let aiInput = $state<HTMLInputElement | null>(null);
  let commandResetKey = $state(0);
  let abortController: AbortController | null = null;

  const captureSearchInput: Attachment<HTMLInputElement> = (node) => {
    searchInput = node;
    return () => {
      if (searchInput === node) searchInput = null;
    };
  };
  const captureAIInput: Attachment<HTMLInputElement> = (node) => {
    aiInput = node;
    return () => {
      if (aiInput === node) aiInput = null;
    };
  };

  const contains = (value: string, query: string): boolean =>
    value.localeCompare(query, undefined, { sensitivity: "base", usage: "search" }) === 0 ||
    value.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  const filterItem = (itemValue: unknown, query: string): boolean => {
    if (typeof itemValue !== "object" || itemValue === null) return false;
    const item = itemValue as Item;
    return (
      contains(item.label, query) ||
      contains(item.value, query) ||
      item.keywords?.some((keyword) => contains(keyword, query)) === true
    );
  };
  const hasResults = $derived(
    !searchQuery.trim() ||
      groups.some((group) => group.items.some((item) => filterItem(item, searchQuery))),
  );

  onDestroy(() => abortController?.abort());

  function resetAIState(): void {
    abortController?.abort();
    abortController = null;
    aiMode = false;
    aiQuery = "";
    submittedQuery = "";
    generating = false;
    response = "";
    error = null;
    referenceLinks = [];
  }

  async function backToSearch(): Promise<void> {
    resetAIState();
    searchQuery = "";
    commandResetKey += 1;
    await tick();
    searchInput?.focus();
  }

  async function generateAI(queryOverride?: string): Promise<void> {
    const query = queryOverride || aiQuery;
    if (!query.trim()) return;

    abortController?.abort();
    const controller = new AbortController();
    abortController = controller;
    error = null;
    generating = true;
    aiQuery = "";
    referenceLinks = [];
    response = "";
    submittedQuery = query;

    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(resolve, 1500);
        controller.signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timeout);
            reject(new Error("aborted"));
          },
          { once: true },
        );
      });
      if (controller.signal.aborted) return;
      generating = false;
      referenceLinks = mockReferenceLinks;
      response = mockAIResponse;
    } catch (caught) {
      if ((caught instanceof Error && caught.message === "aborted") || controller.signal.aborted) {
        return;
      }
      error = "Failed to generate response. Please try again.";
      generating = false;
    }
  }

  function askAI(): void {
    const currentQuery = searchQuery;
    searchQuery = "";
    aiMode = true;
    aiQuery = "";
    if (currentQuery.trim()) void generateAI(currentQuery);
  }

  function handleCaptureEscape(event: KeyboardEvent): void {
    if (!dialogOpen || !aiMode || event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    void backToSearch();
  }

  function close(): void {
    dialogOpen = false;
  }

  $effect(() => {
    if (aiMode && !generating) aiInput?.focus();
  });
</script>

<svelte:document onkeydowncapture={handleCaptureEscape} />

<Button onclick={() => (dialogOpen = true)} variant="outline">Cmdk with AI</Button>
<Command.DialogRoot
  bind:open={dialogOpen}
  onOpenChange={(value) => {
    if (!value) {
      searchQuery = "";
      resetAIState();
    }
  }}
>
  <Command.DialogPopup>
    {#if !aiMode}
      {#key commandResetKey}
        <Command.Root filter={filterItem} items={groups}>
          <div class="relative flex items-center *:first:flex-1">
            <Command.Input
              {@attach captureSearchInput}
              id={searchInputId}
              onkeydown={(event) => {
                if (
                  event.key === "Tab" ||
                  (event.key === "Enter" && !hasResults && searchQuery.trim())
                ) {
                  event.preventDefault();
                  askAI();
                }
              }}
              oninput={(event) => (searchQuery = event.currentTarget.value)}
              placeholder="Type a command or search..."
              value={searchQuery}
            />
            <Button
              class="me-2.5 rounded-md not-hover:text-muted-foreground text-sm sm:text-xs"
              onclick={askAI}
              size="sm"
              variant="ghost"
            >
              <HugeiconsIcon
                aria-hidden="true"
                class="size-4 sm:size-3.5"
                icon={SparklesIcon}
                strokeWidth={2}
              />
              Ask AI
              <Kbd class="ms-0.5 -me-1.5">Tab</Kbd>
            </Button>
          </div>
          <Command.Panel>
            <Command.Empty class="not-empty:py-12">
              {#if searchQuery.trim()}
                <div class="wrap-break-word flex flex-col flex-wrap items-center gap-2">
                  <EmptyMedia variant="icon"
                    ><HugeiconsIcon
                      aria-hidden="true"
                      icon={Search01Icon}
                      strokeWidth={2}
                    /></EmptyMedia
                  >
                  <p>No results found.</p>
                  <p>
                    Press <Kbd>Enter</Kbd> to ask AI about:<br /><strong
                      class="font-medium text-foreground">{searchQuery}</strong
                    >
                  </p>
                </div>
              {/if}
            </Command.Empty>
            <Command.List>
              {#each groups as group (group.value)}
                <Command.Group items={group.items}>
                  <Command.GroupLabel>{group.value}</Command.GroupLabel>
                  <Command.Collection>
                    {#snippet children(item: Item)}
                      <Command.Item onclick={close} value={item}
                        ><span class="flex-1">{item.label}</span
                        >{#if item.shortcut}<Command.Shortcut>{item.shortcut}</Command.Shortcut
                          >{/if}</Command.Item
                      >
                    {/snippet}
                  </Command.Collection>
                </Command.Group>
                <Command.Separator />
              {/each}
            </Command.List>
          </Command.Panel>
          <Command.Footer>
            {#if hasResults}
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <KbdGroup
                    ><Kbd
                      ><HugeiconsIcon
                        aria-hidden="true"
                        icon={ArrowUp01Icon}
                        strokeWidth={2}
                      /></Kbd
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
              </div>
              <div class="flex items-center gap-2"><Kbd>Esc</Kbd><span>Close</span></div>
            {:else}
              <div class="ms-auto flex items-center gap-2"><Kbd>Esc</Kbd><span>Close</span></div>
            {/if}
          </Command.Footer>
        </Command.Root>
      {/key}
    {:else}
      <Command.Root>
        <div class="flex items-center *:first:flex-1">
          <div class="px-2.5 py-1.5">
            <div class="relative w-full">
              <div
                aria-hidden="true"
                class="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5"
                data-slot="autocomplete-start-addon"
              >
                <HugeiconsIcon aria-hidden="true" icon={SparklesIcon} strokeWidth={2} />
              </div>
              <Input
                {@attach captureAIInput}
                aria-label="AI query input"
                class="border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0 *:data-[slot=input]:ps-[calc(--spacing(8.5)-1px)] sm:*:data-[slot=input]:ps-[calc(--spacing(8)-1px)]"
                disabled={generating}
                id={aiInputId}
                onkeydown={(event) => {
                  if (event.key === "Enter" && !generating) void generateAI();
                }}
                oninput={(event) => (aiQuery = event.currentTarget.value)}
                placeholder="Ask AI anything…"
                size="lg"
                value={aiQuery}
              />
            </div>
          </div>
          <Button
            class="me-2.5 rounded-md not-hover:text-muted-foreground text-sm sm:text-xs"
            onclick={() => void backToSearch()}
            size="sm"
            variant="ghost"
          >
            <HugeiconsIcon
              aria-hidden="true"
              class="size-4 sm:size-3.5"
              icon={ArrowLeft01Icon}
              strokeWidth={2}
            />Back to search<Kbd class="ms-0.5 -me-1.5">Esc</Kbd>
          </Button>
        </div>
        <Command.Panel>
          <ScrollArea overscrollContain scrollbarGutter scrollFade>
            <div class="p-5">
              {#if !generating && !response && !error}<div
                  class="flex items-center justify-center py-12"
                >
                  <p class="text-muted-foreground text-sm">
                    Ask AI anything and press <Kbd>Enter</Kbd> to get started.
                  </p>
                </div>{/if}
              {#if error}<div aria-live="polite" class="text-destructive text-sm" role="alert">
                  {error}
                </div>{/if}
              {#if generating}
                <div class="flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <Skeleton class="h-4 w-full" /><Skeleton class="h-4 w-full" /><Skeleton
                      class="h-4 w-full"
                    /><Skeleton class="h-4 w-1/2" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <Skeleton class="h-4 w-full" /><Skeleton class="h-4 w-full" /><Skeleton
                      class="h-4 w-3/4"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <Skeleton class="h-4 w-full" /><Skeleton class="h-4 w-full" /><Skeleton
                      class="h-4 w-full"
                    /><Skeleton class="h-4 w-3/5" />
                  </div>
                </div>
              {/if}
              {#if response && !generating}
                <div
                  aria-live="polite"
                  class="text-muted-foreground text-sm **:[a]:underline **:[a]:underline-offset-4 **:[code]:rounded-md **:[code]:bg-muted **:[code]:px-[0.3rem] **:[code]:py-[0.2rem] **:[code]:font-mono **:[p]:not-first:mt-3 **:[p]:leading-relaxed **:[strong,a]:font-medium **:[strong,a]:text-foreground"
                >
                  {#each response.split("\n\n") as paragraph}<p>{paragraph}</p>{/each}
                </div>
                {#if referenceLinks.length > 0}<div class="mt-4 flex flex-wrap gap-2">
                    {#each referenceLinks as link (`${link.url}-${link.title}`)}<Button
                        href={link.url}
                        size="sm"
                        variant="secondary">{link.title}</Button
                      >{/each}
                  </div>{/if}
              {/if}
            </div>
          </ScrollArea>
        </Command.Panel>
        <Command.Footer>
          {#if generating}
            <div aria-live="polite" class="flex items-center gap-2">
              <div class="flex h-5 items-center justify-center"><Spinner class="size-3" /></div>
              <span class="animate-pulse">Generating response…</span>
            </div>
          {:else if response}
            <div class="flex items-center gap-2">
              <div class="flex h-5 items-center justify-center">
                <HugeiconsIcon
                  aria-hidden="true"
                  class="size-3"
                  icon={CircleQuestionMarkIcon}
                  strokeWidth={2}
                />
              </div>
              You asked:<span>"{submittedQuery}"</span>
            </div>
          {:else}
            <div class="flex items-center gap-2">
              <Kbd
                ><HugeiconsIcon aria-hidden="true" icon={CornerDownLeftIcon} strokeWidth={2} /></Kbd
              ><span>Ask AI</span>
            </div>
          {/if}
        </Command.Footer>
      </Command.Root>
    {/if}
  </Command.DialogPopup>
</Command.DialogRoot>
