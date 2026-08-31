<script lang="ts">
  import ArrowTurnBackwardIcon from "@hugeicons/core-free-icons/ArrowTurnBackwardIcon";
  import Atom01Icon from "@hugeicons/core-free-icons/Atom01Icon";
  import BookOpen02Icon from "@hugeicons/core-free-icons/BookOpen02Icon";
  import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { Autocomplete } from "@shardsui/svelte/autocomplete";
  import { Dialog } from "@shardsui/svelte/dialog";
  import { goto } from "$app/navigation";
  import {
    commandNavigationGroups,
    type NavigationGroup,
    type NavigationItem,
  } from "./navigation.js";

  type CommandItem = NavigationItem;
  type CommandGroup = NavigationGroup & { value: string };
  const groups: CommandGroup[] = commandNavigationGroups.map(({ items, label }) => ({
    items: [...items],
    label,
    value: label,
  }));

  let open = $state(false);
  let query = $state("");
  let input = $state<HTMLInputElement | null>(null);
  let popup = $state<HTMLElement | null>(null);
  let highlighted = $state<CommandItem>();
  let copied = $state(false);
  let isMac = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  function itemLabel(item: CommandItem | CommandGroup) {
    return "href" in item ? item.label : item.value;
  }

  function componentCommand(item: CommandItem) {
    return item.componentSlug
      ? `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/${item.componentSlug}.json`
      : undefined;
  }

  async function copyHighlightedCommand() {
    if (!highlighted) return;
    const command = componentCommand(highlighted);
    if (!command) return;

    try {
      await navigator.clipboard.writeText(command);
      copied = true;
      if (copyTimer) clearTimeout(copyTimer);
      copyTimer = setTimeout(() => (copied = false), 1200);
    } catch {
      copied = false;
    }
  }

  function selectItem(item: CommandItem) {
    open = false;
    if (/^https?:\/\//.test(item.href)) {
      window.location.assign(item.href);
      return;
    }
    void goto(item.href);
  }

  function setCommandMenuOpen(nextOpen: boolean) {
    open = nextOpen;
  }

  function handleInputKeydown(event: KeyboardEvent & { preventShardsUIHandler?: () => void }) {
    if (event.key !== "Home" && event.key !== "End") return;

    const options = popup
      ? [...popup.querySelectorAll<HTMLElement>('[role="option"]')].filter(
          (option) => option.getAttribute("aria-disabled") !== "true" && !option.hidden,
        )
      : [];
    const option = event.key === "Home" ? options.at(0) : options.at(-1);
    if (!option) return;

    event.preventDefault();
    event.stopPropagation();
    event.preventShardsUIHandler?.();
    option.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
    option.scrollIntoView({ block: "nearest" });
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    const target = event.target;
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable);
    const isCommandMenuShortcut =
      event.key === "/" || (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey));

    if (isCommandMenuShortcut) {
      if (isTyping) return;
      event.preventDefault();
      open = !open;
      return;
    }

    if (open && event.key.toLowerCase() === "c" && (event.metaKey || event.ctrlKey)) {
      const command = highlighted ? componentCommand(highlighted) : undefined;
      if (!command) return;
      event.preventDefault();
      void copyHighlightedCommand();
    }
  }

  $effect(() => {
    isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  });

  $effect(() => {
    if (!open) return;
    query = "";
    highlighted = undefined;
    copied = false;
  });

  $effect(() => () => {
    if (copyTimer) clearTimeout(copyTimer);
  });
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<Dialog.Root {open} onOpenChange={setCommandMenuOpen}>
  <Dialog.Trigger
    class="hidden min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-site-border bg-transparent px-2 shadow-[0_1px_2px_rgb(0_0_0/3%)] hover:bg-site-foreground/4 focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3 md:inline-flex [&_svg]:size-4"
    type="button"
    aria-label="Search documentation"
    aria-haspopup="dialog"
    data-search-trigger
  >
    <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
    <span class="flex gap-0.75"
      ><kbd
        class="inline-flex h-4.75 min-w-4.5 items-center justify-center rounded-[0.3rem] border border-site-border-soft bg-site-foreground/3 text-site-muted text-[0.68rem] leading-none"
        >{isMac ? "⌘" : "Ctrl"}</kbd
      ><kbd
        class="inline-flex h-4.75 min-w-4.5 items-center justify-center rounded-[0.3rem] border border-site-border-soft bg-site-foreground/3 text-site-muted text-[0.68rem] leading-none"
        >K</kbd
      ></span
    >
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Backdrop class="fixed inset-0 z-80 bg-site-overlay backdrop-blur-[2px]" />
    <Dialog.Viewport
      class="fixed inset-0 z-81 flex items-start justify-center overflow-hidden px-4 py-[max(1rem,4vh)] sm:py-[10vh]"
    >
      <Dialog.Popup
        bind:ref={popup}
        class="relative flex h-105 max-h-105 w-full min-w-0 max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-[0_10px_15px_-3px_rgb(0_0_0/5%),0_4px_6px_-4px_rgb(0_0_0/5%)] outline-0 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(1rem-1px)] before:bg-muted/72 before:shadow-[0_1px_rgb(0_0_0/4%)]"
        aria-label="Search documentation"
        initialFocus={() => input}
      >
        <Autocomplete.Root
          bind:value={query}
          open
          items={groups}
          inline
          autoHighlight="always"
          keepHighlight
          itemToStringValue={itemLabel}
          onItemHighlighted={(item) => {
            highlighted = item && "href" in item ? item : undefined;
            copied = false;
          }}
        >
          <div
            class="relative flex min-h-12 items-center px-2.75 py-1.75 [&>svg]:pointer-events-none [&>svg]:absolute [&>svg]:left-5.5 [&>svg]:z-1 [&>svg]:size-4 [&_input]:h-8.5 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:py-0 [&_input]:pr-2.75 [&_input]:pl-7.75 [&_input]:text-sm [&_input]:leading-8.5 [&_input]:outline-0"
          >
            <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
            <Autocomplete.Input
              bind:ref={input}
              onkeydown={handleInputKeydown}
              aria-label="Search documentation"
              placeholder="Search documentation…"
            />
          </div>
          <Dialog.Close class="sr-only">Close command menu</Dialog.Close>

          <div
            class="relative -mx-px h-81.25 min-h-0 flex-[1_1_20.3125rem] overflow-y-auto rounded-t-xl border border-b-0 border-border bg-popover bg-clip-padding py-2 pr-3 pl-2 shadow-xs/5 [clip-path:inset(0_1px)] [&_[role=group]]:block [&_[role=group]]:p-0 [&_[role=group]+[role=group]]:mt-1.5 [&_[role=group]>div:first-child]:m-0 [&_[role=group]>div:first-child]:min-h-7 [&_[role=group]>div:first-child]:px-2 [&_[role=group]>div:first-child]:py-1.5 [&_[role=group]>div:first-child]:text-muted-foreground [&_[role=group]>div:first-child]:text-xs [&_[role=group]>div:first-child]:leading-4 [&_[role=group]>div:first-child]:font-semibold [&_[role=option]]:grid [&_[role=option]]:min-h-8 [&_[role=option]]:grid-cols-[1rem_minmax(0,1fr)] [&_[role=option]]:items-center [&_[role=option]]:gap-2 [&_[role=option]]:rounded-sm [&_[role=option]]:px-2 [&_[role=option]]:py-1.5 [&_[role=option]]:text-sm [&_[role=option]]:leading-5 [&_[role=option]]:outline-0 [&_[role=option][data-highlighted]]:bg-muted"
            data-command-results
          >
            <Autocomplete.Empty>
              <p class="m-0 p-12 text-center text-site-muted">No results found.</p>
            </Autocomplete.Empty>
            <Autocomplete.List>
              <Autocomplete.Collection>
                {#snippet children(group: CommandGroup)}
                  <Autocomplete.Group items={group.items}>
                    <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
                    <Autocomplete.Collection>
                      {#snippet children(item: CommandItem)}
                        <Autocomplete.Item value={item} onclick={() => selectItem(item)}>
                          <span
                            class="block size-4 [&_svg]:block [&_svg]:size-4"
                            aria-hidden="true"
                          >
                            {#if item.componentSlug}
                              <HugeiconsIcon icon={Atom01Icon} strokeWidth={1.5} />
                            {:else}
                              <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={1.5} />
                            {/if}
                          </span>
                          <span>{item.label}</span>
                        </Autocomplete.Item>
                      {/snippet}
                    </Autocomplete.Collection>
                  </Autocomplete.Group>
                {/snippet}
              </Autocomplete.Collection>
            </Autocomplete.List>
          </div>

          <div
            class="relative flex min-h-11.25 items-center justify-between gap-2 rounded-b-[calc(1rem-1px)] border-border border-t px-5 py-3 text-muted-foreground text-xs"
            aria-live="polite"
          >
            <span class="flex min-w-0 items-center gap-1">
              <span>Go to Page</span>
              <kbd aria-label="Enter"><HugeiconsIcon icon={ArrowTurnBackwardIcon} size={12} /></kbd>
            </span>
            {#if highlighted?.componentSlug}
              <span class="flex min-w-0 items-center gap-2">
                <span class="overflow-hidden font-mono text-ellipsis whitespace-nowrap"
                  >{copied ? "Copied" : componentCommand(highlighted)}</span
                >
                <span class="flex min-w-0 items-center gap-1"
                  ><kbd>{isMac ? "⌘" : "Ctrl"}</kbd><kbd>C</kbd></span
                >
              </span>
            {/if}
          </div>
        </Autocomplete.Root>
      </Dialog.Popup>
    </Dialog.Viewport>
  </Dialog.Portal>
</Dialog.Root>
