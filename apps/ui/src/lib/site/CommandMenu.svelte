<script lang="ts">
  import {
    ArrowTurnBackwardIcon,
    Atom01Icon,
    BookOpen02Icon,
    Search01Icon,
  } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { Autocomplete } from "@shardsui/svelte/autocomplete";
  import { Dialog } from "@shardsui/svelte/dialog";
  import { goto } from "$app/navigation";
  import { componentCategories } from "./categories.js";
  import {
    hooksNavigation,
    overviewNavigation,
    primaryNavigation,
    resourcesNavigation,
  } from "./site.js";

  type CommandItem = {
    href: string;
    label: string;
    componentSlug?: string;
  };

  type CommandGroup = {
    value: string;
    items: CommandItem[];
  };

  const groups: CommandGroup[] = [
    { value: "Pages", items: [...primaryNavigation] },
    { value: "Overview", items: [...overviewNavigation] },
    {
      value: "Components",
      items: componentCategories.map(({ docsName, name, slug }) => ({
        href: `/docs/components/${slug}`,
        label: docsName ?? name,
        componentSlug: slug,
      })),
    },
    { value: "Hooks", items: [...hooksNavigation] },
    { value: "Resources", items: [...resourcesNavigation] },
  ];

  let open = $state(false);
  let query = $state("");
  let input = $state<HTMLInputElement | null>(null);
  let popup = $state<HTMLElement | null>(null);
  let highlighted = $state<CommandItem>();
  let copied = $state(false);
  let isMac = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  function itemLabel(item: CommandItem | CommandGroup) {
    return "label" in item ? item.label : item.value;
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

    await navigator.clipboard.writeText(command);
    copied = true;
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied = false), 1200);
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
    class="search-trigger"
    type="button"
    aria-label="Search documentation"
    aria-haspopup="dialog"
  >
    <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
    <span class="search-shortcut"><kbd>{isMac ? "⌘" : "Ctrl"}</kbd><kbd>K</kbd></span>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Backdrop class="command-backdrop" />
    <Dialog.Viewport class="command-viewport">
      <Dialog.Popup
        bind:ref={popup}
        class="command-popup"
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
            highlighted = item && "label" in item ? item : undefined;
            copied = false;
          }}
        >
          <div class="command-input-row">
            <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
            <Autocomplete.Input
              bind:ref={input}
              onkeydown={handleInputKeydown}
              aria-label="Search documentation"
              placeholder="Search documentation…"
            />
          </div>
          <Dialog.Close class="sr-only">Close command menu</Dialog.Close>

          <div class="command-results">
            <Autocomplete.Empty>
              <p class="command-empty">No results found.</p>
            </Autocomplete.Empty>
            <Autocomplete.List>
              <Autocomplete.Collection>
                {#snippet children(group: CommandGroup)}
                  <Autocomplete.Group items={group.items}>
                    <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
                    <Autocomplete.Collection>
                      {#snippet children(item: CommandItem)}
                        <Autocomplete.Item value={item} onclick={() => selectItem(item)}>
                          <span class="command-item-icon" aria-hidden="true">
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

          <div class="command-footer" aria-live="polite">
            <span class="command-footer-action">
              <span>Go to Page</span>
              <kbd aria-label="Enter"><HugeiconsIcon icon={ArrowTurnBackwardIcon} size={12} /></kbd>
            </span>
            {#if highlighted?.componentSlug}
              <span class="command-copy-payload">
                <span>{copied ? "Copied" : componentCommand(highlighted)}</span>
                <span><kbd>{isMac ? "⌘" : "Ctrl"}</kbd><kbd>C</kbd></span>
              </span>
            {/if}
          </div>
        </Autocomplete.Root>
      </Dialog.Popup>
    </Dialog.Viewport>
  </Dialog.Portal>
</Dialog.Root>
