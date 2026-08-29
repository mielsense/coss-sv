<script lang="ts">
  type TocItem = {
    id: string;
    title: string;
    depth: number;
  };

  let items = $state<TocItem[]>([]);
  let activeId = $state<string>();

  $effect(() => {
    let intersectionObserver: IntersectionObserver | undefined;

    function rebuild(): void {
      intersectionObserver?.disconnect();
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

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) activeId = entry.target.id;
          }
        },
        { rootMargin: "0% 0% -80% 0%" },
      );
      for (const heading of headings) intersectionObserver.observe(heading);
    }

    function touchesDocsContent(record: MutationRecord): boolean {
      if (record.target instanceof Element && record.target.closest(".docs-content")) return true;
      return [...record.addedNodes, ...record.removedNodes].some(
        (node) =>
          node instanceof Element &&
          (node.matches(".docs-content") || node.querySelector(".docs-content")),
      );
    }

    rebuild();
    const mutationObserver = new MutationObserver((records) => {
      if (records.length === 0 || records.some(touchesDocsContent)) rebuild();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver?.disconnect();
      mutationObserver.disconnect();
    };
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
          data-depth={item.depth}>{item.title}</a
        >
      {/each}
    </nav>
  </aside>
{/if}
