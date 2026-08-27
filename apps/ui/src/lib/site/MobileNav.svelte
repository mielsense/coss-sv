<script lang="ts">
import { componentCategories } from "./categories.js";
import {
  hooksNavigation,
  overviewNavigation,
  primaryNavigation,
  resourcesNavigation,
} from "./site.js";

let dialog: HTMLDialogElement;
let menuOpen = $state(false);

function openMenu() {
  dialog.showModal();
  menuOpen = true;
}

function closeMenu() {
  dialog.close();
  menuOpen = false;
}

function closeFromBackdrop(event: MouseEvent) {
  if (event.target === dialog) closeMenu();
}

function closeFromKeyboard(event: KeyboardEvent) {
  if (event.key === "Escape") closeMenu();
}
</script>

<button
  class="mobile-menu-trigger"
  type="button"
  onclick={openMenu}
  aria-label="Toggle Menu"
  aria-haspopup="dialog"
  aria-expanded={menuOpen}
>
  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 17h16" /></svg>
</button>

<dialog
  bind:this={dialog}
  class="mobile-menu-dialog"
  onclick={closeFromBackdrop}
  onkeydown={closeFromKeyboard}
  onclose={() => (menuOpen = false)}
  aria-label="Menu"
>
  <div class="mobile-menu-panel">
    <button class="mobile-menu-close" type="button" onclick={closeMenu} aria-label="Close Menu">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
    </button>
    <nav aria-label="Mobile navigation">
      <section aria-labelledby="mobile-menu-heading">
        <h2 id="mobile-menu-heading">Menu</h2>
        <a href="/" onclick={closeMenu}>Home</a>
        {#each primaryNavigation as item (item.href)}
          <a href={item.href} onclick={closeMenu}>{item.label}</a>
        {/each}
      </section>
      <section aria-labelledby="mobile-overview-heading">
        <h2 id="mobile-overview-heading">Overview</h2>
        {#each overviewNavigation as item (item.href)}
          <a href={item.href} onclick={closeMenu}>{item.label}</a>
        {/each}
      </section>
      <section aria-labelledby="mobile-components-heading">
        <h2 id="mobile-components-heading">Components</h2>
        {#each componentCategories as item (item.slug)}
          <a href={`/docs/components/${item.slug}`} onclick={closeMenu}>
            {item.name}
            {#if item.isNew}
              <span class="new-badge">New</span>
            {/if}
          </a>
        {/each}
      </section>
      <section aria-labelledby="mobile-hooks-heading">
        <h2 id="mobile-hooks-heading">Hooks</h2>
        {#each hooksNavigation as item (item.href)}
          <a href={item.href} onclick={closeMenu}>{item.label}</a>
        {/each}
      </section>
      <section aria-labelledby="mobile-resources-heading">
        <h2 id="mobile-resources-heading">Resources</h2>
        {#each resourcesNavigation as item (item.href)}
          <a href={item.href} onclick={closeMenu}>{item.label}</a>
        {/each}
      </section>
    </nav>
  </div>
</dialog>
