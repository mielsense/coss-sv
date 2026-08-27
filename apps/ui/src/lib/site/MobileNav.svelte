<script lang="ts">
import { Drawer } from "@shardsui/svelte/drawer";
import { componentCategories } from "./categories.js";
import {
  hooksNavigation,
  overviewNavigation,
  primaryNavigation,
  resourcesNavigation,
} from "./site.js";

let menuOpen = $state(false);

function setMenuOpen(nextOpen: boolean) {
  menuOpen = nextOpen;
}
</script>

<Drawer.Root open={menuOpen} onOpenChange={setMenuOpen} swipeDirection="left">
  <Drawer.Trigger
    class="mobile-menu-trigger"
    type="button"
    aria-label="Toggle Menu"
    aria-haspopup="dialog"
    aria-expanded={menuOpen}
  >
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 17h16" /></svg>
  </Drawer.Trigger>

  <Drawer.Portal>
    <Drawer.Backdrop class="mobile-menu-backdrop" />
    <Drawer.Viewport class="mobile-menu-viewport">
      <Drawer.Popup class="mobile-menu-dialog" aria-label="Menu">
        <Drawer.Close class="mobile-menu-close" type="button" aria-label="Close Menu">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </Drawer.Close>
        <Drawer.Content class="mobile-menu-panel">
          <nav aria-label="Mobile navigation">
            <section aria-labelledby="mobile-menu-heading">
              <h2 id="mobile-menu-heading">Menu</h2>
              <a href="/" onclick={() => setMenuOpen(false)}>Home</a>
              {#each primaryNavigation as item (item.href)}
                <a href={item.href} onclick={() => setMenuOpen(false)}>{item.label}</a>
              {/each}
            </section>
            <section aria-labelledby="mobile-overview-heading">
              <h2 id="mobile-overview-heading">Overview</h2>
              {#each overviewNavigation as item (item.href)}
                <a href={item.href} onclick={() => setMenuOpen(false)}>{item.label}</a>
              {/each}
            </section>
            <section aria-labelledby="mobile-components-heading">
              <h2 id="mobile-components-heading">Components</h2>
              {#each componentCategories as item (item.slug)}
                <a href={`/docs/components/${item.slug}`} onclick={() => setMenuOpen(false)}>
                  {item.docsName ?? item.name}
                  {#if item.isNew}
                    <span class="new-badge">New</span>
                  {/if}
                </a>
              {/each}
            </section>
            <section aria-labelledby="mobile-hooks-heading">
              <h2 id="mobile-hooks-heading">Hooks</h2>
              {#each hooksNavigation as item (item.href)}
                <a href={item.href} onclick={() => setMenuOpen(false)}>{item.label}</a>
              {/each}
            </section>
            <section aria-labelledby="mobile-resources-heading">
              <h2 id="mobile-resources-heading">Resources</h2>
              {#each resourcesNavigation as item (item.href)}
                <a href={item.href} onclick={() => setMenuOpen(false)}>{item.label}</a>
              {/each}
            </section>
          </nav>
        </Drawer.Content>
      </Drawer.Popup>
    </Drawer.Viewport>
  </Drawer.Portal>
</Drawer.Root>
