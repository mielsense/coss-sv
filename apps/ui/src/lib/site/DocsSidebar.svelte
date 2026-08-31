<script lang="ts">
  import { page } from "$app/state";
  import { ScrollArea } from "@coss-sv/ui";
  import { documentationNavigationGroups } from "./navigation.js";
  import NewBadge from "./NewBadge.svelte";
</script>

<aside
  class="sticky top-16 hidden h-[calc(100svh-4rem)] w-64 self-start overflow-hidden lg:block"
  aria-label="Documentation navigation"
  data-docs-sidebar
>
  <ScrollArea
    class="size-full **:data-[slot=scroll-area-scrollbar]:hidden"
    fill
    overscrollContain
    scrollFade
  >
    <nav class="flex flex-col gap-6 px-4 pt-10 pb-8" data-docs-sidebar-nav>
      {#each documentationNavigationGroups as group (group.label)}
        <section
          class="flex flex-col gap-1 px-2"
          aria-labelledby={`docs-sidebar-${group.label.toLowerCase()}`}
          data-docs-sidebar-group
        >
          <h2
            class="m-0 min-h-7 px-0 text-site-foreground text-xs leading-7 font-medium"
            id={`docs-sidebar-${group.label.toLowerCase()}`}
          >
            {group.label}
          </h2>
          <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
            {#each group.items as item (item.href)}
              <li>
                <a
                  class="flex min-h-8 items-center justify-between gap-2 rounded-lg px-3.5 py-1.5 text-site-muted text-sm leading-5 no-underline hover:text-site-foreground aria-[current=page]:bg-site-foreground/4 aria-[current=page]:text-site-foreground"
                  href={item.href}
                  aria-current={page.url.pathname === item.href ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {#if item.isNew}
                    <NewBadge />
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    </nav>
  </ScrollArea>
</aside>
