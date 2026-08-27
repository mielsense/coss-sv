<script lang="ts">
type TocItem = {
  id: string;
  title: string;
  depth: number;
};

let items = $state<TocItem[]>([]);
let activeId = $state<string>();

$effect(() => {
  const headings = [
    ...document.querySelectorAll<HTMLElement>(
      ".docs-content h2[id], .docs-content h3[id], .docs-content h4[id]",
    ),
  ];
  const nextItems = headings.map((heading) => ({
    id: heading.id,
    title: heading.textContent?.trim() ?? "",
    depth: Number(heading.tagName.slice(1)),
  }));
  items = nextItems;
  activeId = nextItems[0]?.id;

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

{#if items.length > 0}
  <aside class="docs-toc" aria-label="On this page">
    <p>On This Page</p>
    <nav>
      {#each items as item (item.id)}
        <a
          href={`#${item.id}`}
          aria-current={activeId === item.id ? "location" : undefined}
          data-depth={item.depth}
          >{item.title}</a
        >
      {/each}
    </nav>
  </aside>
{/if}
