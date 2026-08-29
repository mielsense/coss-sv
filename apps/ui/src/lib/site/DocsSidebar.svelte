<script lang="ts">
  import { page } from "$app/state";
  import { componentCategories } from "./categories.js";
  import { hooksNavigation, overviewNavigation, resourcesNavigation } from "./site.js";

  type NavigationItem = {
    href: string;
    label: string;
    isNew?: boolean | undefined;
  };

  const componentNavigation: NavigationItem[] = componentCategories.map(
    ({ docsName, isNew, name, slug }) => ({
      href: `/docs/components/${slug}`,
      label: docsName ?? name,
      isNew,
    }),
  );

  const groups: { label: string; items: readonly NavigationItem[] }[] = [
    { label: "Overview", items: overviewNavigation },
    { label: "Components", items: componentNavigation },
    { label: "Hooks", items: hooksNavigation },
    { label: "Resources", items: resourcesNavigation },
  ];
</script>

<aside class="docs-sidebar" aria-label="Documentation navigation">
  <nav>
    {#each groups as group (group.label)}
      <section aria-labelledby={`docs-sidebar-${group.label.toLowerCase()}`}>
        <h2 id={`docs-sidebar-${group.label.toLowerCase()}`}>{group.label}</h2>
        <ul>
          {#each group.items as item (item.href)}
            <li>
              <a
                href={item.href}
                aria-current={page.url.pathname === item.href ? "page" : undefined}
              >
                <span>{item.label}</span>
                {#if item.isNew}
                  <span class="new-badge">New</span>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </nav>
</aside>
