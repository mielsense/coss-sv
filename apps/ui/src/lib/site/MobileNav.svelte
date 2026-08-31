<script lang="ts">
  import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
  import Menu09Icon from "@hugeicons/core-free-icons/Menu09Icon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { Drawer } from "@shardsui/svelte/drawer";
  import { documentationNavigationGroups } from "./navigation.js";
  import NewBadge from "./NewBadge.svelte";
  import { primaryNavigation } from "./site.js";

  let menuOpen = $state(false);

  function setMenuOpen(nextOpen: boolean) {
    menuOpen = nextOpen;
  }
</script>

<Drawer.Root open={menuOpen} onOpenChange={setMenuOpen} swipeDirection="left">
  <Drawer.Trigger
    class="-ms-1.5 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-transparent p-0 hover:bg-site-foreground/4 focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3 lg:hidden [&_svg]:size-4"
    type="button"
    aria-label="Toggle Menu"
    aria-haspopup="dialog"
    aria-expanded={menuOpen}
    data-mobile-menu-trigger
  >
    <HugeiconsIcon aria-hidden="true" icon={Menu09Icon} strokeWidth={2} />
  </Drawer.Trigger>

  <Drawer.Portal>
    <Drawer.Backdrop
      class="fixed inset-0 z-80 bg-site-overlay opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-[2px] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0"
    />
    <Drawer.Viewport class="fixed inset-0 z-81 flex touch-none justify-start overflow-hidden">
      <Drawer.Popup
        class="relative m-0 flex h-dvh max-h-none w-[min(22rem,calc(100%-3rem))] max-w-none translate-x-[var(--drawer-swipe-movement-x)] flex-col overflow-hidden border-0 border-site-border-soft border-r bg-site-panel shadow-[0_10px_15px_-3px_rgb(0_0_0/5%),0_4px_6px_-4px_rgb(0_0_0/5%)] outline-none transition-[transform,box-shadow] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:-translate-x-full data-ending-style:duration-[calc(450ms*(1-var(--drawer-swipe-progress)))] data-starting-style:-translate-x-full data-swiping:duration-0"
        aria-label="Menu"
        data-mobile-menu-dialog
      >
        <Drawer.Close
          class="absolute top-2 right-2 z-2 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 hover:bg-site-foreground/4 focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3 [&_svg]:size-4"
          type="button"
          aria-label="Close Menu"
        >
          <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
        </Drawer.Close>
        <Drawer.Content
          class="relative h-full touch-pan-y overflow-y-auto overscroll-contain bg-site-panel px-6 py-8 outline-none"
          data-mobile-menu-panel
        >
          <nav class="flex flex-col gap-9" aria-label="Mobile navigation">
            <section class="flex flex-col gap-0.5" aria-labelledby="mobile-menu-heading">
              <h2 class="m-0 mb-2.5 text-sm font-semibold" id="mobile-menu-heading">Menu</h2>
              <a
                class="flex min-h-9 items-center gap-2 text-site-muted no-underline hover:text-site-accent-foreground"
                href="/"
                onclick={() => setMenuOpen(false)}>Home</a
              >
              {#each primaryNavigation as item (item.href)}
                <a
                  class="flex min-h-9 items-center gap-2 text-site-muted no-underline hover:text-site-accent-foreground"
                  href={item.href}
                  onclick={() => setMenuOpen(false)}>{item.label}</a
                >
              {/each}
            </section>
            {#each documentationNavigationGroups as group (group.label)}
              <section
                class="flex flex-col gap-0.5"
                aria-labelledby={`mobile-${group.label.toLowerCase()}-heading`}
              >
                <h2
                  class="m-0 mb-2.5 text-sm font-semibold"
                  id={`mobile-${group.label.toLowerCase()}-heading`}
                >
                  {group.label}
                </h2>
                {#each group.items as item (item.href)}
                  <a
                    class="flex min-h-9 items-center gap-2 text-site-muted no-underline hover:text-site-accent-foreground"
                    href={item.href}
                    onclick={() => setMenuOpen(false)}
                  >
                    {item.label}
                    {#if item.isNew}<NewBadge />{/if}
                  </a>
                {/each}
              </section>
            {/each}
          </nav>
        </Drawer.Content>
      </Drawer.Popup>
    </Drawer.Viewport>
  </Drawer.Portal>
</Drawer.Root>
