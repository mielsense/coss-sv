<script lang="ts">
import { componentCategories } from "./categories.js";
import { overviewNavigation, primaryNavigation } from "./site.js";

let dialog: HTMLDialogElement;
let input: HTMLInputElement;
let query = $state("");

let results = $derived.by(() => {
  const normalized = query.trim().toLowerCase();
  const pages = [...primaryNavigation, ...overviewNavigation].map((item) => ({
    ...item,
    group: "Pages",
  }));
  const components = componentCategories.map((item) => ({
    href: `/docs/components/${item.slug}`,
    label: item.name,
    group: "Components",
  }));
  const all = [...pages, ...components];
  return normalized ? all.filter((item) => item.label.toLowerCase().includes(normalized)) : all;
});

function openCommandMenu() {
  query = "";
  dialog.showModal();
  requestAnimationFrame(() => input.focus());
}

function closeCommandMenu() {
  dialog.close();
}

function closeFromBackdrop(event: MouseEvent) {
  if (event.target === dialog) closeCommandMenu();
}

function closeFromKeyboard(event: KeyboardEvent) {
  if (event.key === "Escape") closeCommandMenu();
}

$effect(() => {
  function handleShortcut(event: KeyboardEvent) {
    const target = event.target;
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable);

    if (isTyping) return;
    if (
      (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
      event.key === "/"
    ) {
      event.preventDefault();
      if (dialog.open) closeCommandMenu();
      else openCommandMenu();
    }
  }

  document.addEventListener("keydown", handleShortcut);
  return () => document.removeEventListener("keydown", handleShortcut);
});
</script>

<button
  class="search-trigger"
  type="button"
  onclick={openCommandMenu}
  aria-label="Search documentation"
>
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
  <span class="search-shortcut"><kbd>⌘</kbd><kbd>K</kbd></span>
</button>

<dialog
  bind:this={dialog}
  class="command-dialog"
  onclick={closeFromBackdrop}
  onkeydown={closeFromKeyboard}
  aria-label="Search documentation"
>
  <div class="command-panel">
    <label class="command-input-row">
      <span class="sr-only">Search documentation</span>
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
      <input bind:this={input} bind:value={query} placeholder="Search documentation…">
      <kbd>Esc</kbd>
    </label>
    <div class="command-results">
      {#if results.length === 0}
        <p class="command-empty">No results found.</p>
      {:else}
        {#each ["Pages", "Components"] as group}
          {#if results.some((item) => item.group === group)}
            <section aria-labelledby={`command-${group.toLowerCase()}`}>
              <h2 id={`command-${group.toLowerCase()}`}>{group}</h2>
              {#each results.filter((item) => item.group === group) as item (`${item.group}-${item.label}-${item.href}`)}
                <a href={item.href} onclick={closeCommandMenu}>{item.label}</a>
              {/each}
            </section>
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</dialog>
