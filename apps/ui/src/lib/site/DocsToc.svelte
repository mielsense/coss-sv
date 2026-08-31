<script lang="ts">
  import type { TableOfContentsItem } from "@/content/compiler.js";
  import { ScrollArea } from "@coss-sv/ui";

  let { items }: { items: readonly TableOfContentsItem[] } = $props();
  let activeId = $state<string>();
  const visibleItems = $derived(items.filter((item) => item.depth >= 2 && item.depth <= 4));

  $effect(() => {
    activeId = visibleItems[0]?.id;
    const headings = visibleItems
      .map(({ id }) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading instanceof HTMLElement);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeId = entry.target.id;
        }
      },
      { rootMargin: "0% 0% -80% 0%" },
    );
    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  });
</script>

{#if visibleItems.length > 0}
  <aside
    class="sticky top-16 hidden h-[calc(100svh-4rem)] self-start overflow-hidden min-[80rem]:flex"
    aria-label="On this page"
    data-docs-toc
  >
    <ScrollArea
      class="size-full **:data-[slot=scroll-area-scrollbar]:hidden"
      overscrollContain
      scrollFade
    >
      <div class="flex min-h-0 flex-col gap-1 py-8 pr-4 pl-6 pt-10">
        <p class="m-0 min-h-7 text-xs leading-7 font-medium">On This Page</p>
        <nav
          class="relative ms-3.5 flex flex-col gap-0.5 before:absolute before:inset-y-0 before:-left-3.25 before:w-px before:bg-site-border"
        >
          {#each visibleItems as item (item.id)}
            <a
              class="relative py-1 text-site-muted text-[0.8125rem] leading-4.5 no-underline data-[depth=3]:ps-3.5 data-[depth=4]:ps-5.5 aria-[current=location]:text-site-foreground aria-[current=location]:before:absolute aria-[current=location]:before:inset-y-px aria-[current=location]:before:-left-3.25 aria-[current=location]:before:w-0.5 aria-[current=location]:before:rounded-full aria-[current=location]:before:bg-site-primary"
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
              data-depth={item.depth}>{item.text}</a
            >
          {/each}
        </nav>
      </div>
    </ScrollArea>
  </aside>
{/if}
