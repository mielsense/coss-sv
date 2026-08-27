<script lang="ts">
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
    items: componentCategories.map(({ name, slug }) => ({
      href: `/docs/components/${slug}`,
      label: name,
      componentSlug: slug,
    })),
  },
  { value: "Hooks", items: [...hooksNavigation] },
  { value: "Resources", items: [...resourcesNavigation] },
];

let open = $state(false);
let query = $state("");
let input = $state<HTMLInputElement | null>(null);
let highlighted = $state<CommandItem>();
let copied = $state(false);
let isMac = $state(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;

function itemLabel(item: CommandItem | CommandGroup) {
  return "label" in item ? item.label : item.value;
}

function componentCommand(item: CommandItem) {
  return item.componentSlug
    ? `pnpm dlx shadcn-svelte@latest add @coss-sv/${item.componentSlug}`
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

function handleWindowKeydown(event: KeyboardEvent) {
  const target = event.target;
  const isTyping =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable);

  if (
    (!isTyping && event.key === "/") ||
    (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey))
  ) {
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

<Dialog.Root bind:open>
  <Dialog.Trigger class="search-trigger" aria-label="Search documentation" aria-haspopup="dialog">
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
    <span class="search-shortcut"><kbd>{isMac ? "⌘" : "Ctrl"}</kbd><kbd>K</kbd></span>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Backdrop class="command-backdrop" />
    <Dialog.Viewport class="command-viewport">
      <Dialog.Popup
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
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <Autocomplete.Input
              bind:ref={input}
              aria-label="Search documentation"
              placeholder="Search documentation…"
            />
            <kbd>Esc</kbd>
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
                              <svg aria-hidden="true" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="2.5" />
                                <ellipse cx="12" cy="12" rx="9" ry="3.8" />
                                <ellipse
                                  cx="12"
                                  cy="12"
                                  rx="9"
                                  ry="3.8"
                                  transform="rotate(60 12 12)"
                                />
                                <ellipse
                                  cx="12"
                                  cy="12"
                                  rx="9"
                                  ry="3.8"
                                  transform="rotate(120 12 12)"
                                />
                              </svg>
                            {:else}
                              <svg aria-hidden="true" viewBox="0 0 24 24">
                                <path d="M6.5 3.5h8l3 3v14h-11zM14.5 3.5v4h3M9 12h6M9 15.5h6" />
                              </svg>
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
              <kbd>↵</kbd>
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
