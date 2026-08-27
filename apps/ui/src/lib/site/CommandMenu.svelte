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
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
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
                                <path
                                  d="M7.99988 4.98096H6C4.11438 4.98096 3.17157 4.98096 2.58579 5.56674C2 6.15253 2 7.09557 2 8.98164V15.8809C2 17.3806 2 18.1304 2.38151 18.6559C2.50511 18.8262 2.6548 18.9758 2.82505 19.0994C3.35059 19.481 4.10006 19.481 5.59901 19.481H8.95053C10.433 19.481 11.7093 20.5273 12 21.981V6.98096C11.7072 6.59051 11.5608 6.39529 11.401 6.22697C10.756 5.5476 9.89308 5.11614 8.96261 5.0078C8.73208 4.98096 8.48802 4.98096 7.99988 4.98096Z"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M12 6.98096V21.981C12.2907 20.5273 13.5671 19.481 15.0495 19.481H18.401C19.8999 19.481 20.6494 19.481 21.1749 19.0994C21.3452 18.9758 21.4949 18.8262 21.6185 18.6559C22 18.1304 22 17.3806 22 15.8809V7.48149C22 7.01648 22 6.78397 21.9616 6.59078C21.8038 5.7974 21.1836 5.1772 20.3902 5.01939C20.197 4.98096 19.9647 4.98096 19.5 4.98096"
                                  stroke-linecap="square"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M12 7.48076C12 7.48076 12.7705 3.2432 17.0165 2.20721C17.829 2.00897 18.2353 1.90985 18.6176 2.21013C19 2.51042 19 3.00053 19 3.98076V14.4808C19 15.3494 19 15.7837 18.7865 16.0556C18.5729 16.3275 18.0541 16.4541 17.0165 16.7072C12.7705 17.7432 12 21.9808 12 21.9808"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
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
