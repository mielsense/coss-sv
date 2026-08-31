<script lang="ts">
  import { Badge } from "@coss-sv/ui";
  import { useMediaQuery } from "../../../../registry/default/hooks/use-media-query.svelte.js";
  import type { MediaQuery } from "svelte/reactivity";

  type Row = {
    description?: string;
    label: string;
    query: MediaQuery;
  };

  const sections: Array<{ rows: Row[]; title: string }> = [
    {
      rows: [
        {
          description: "≥ 640px",
          label: 'useMediaQuery("sm")',
          query: useMediaQuery("sm"),
        },
        {
          description: "≥ 800px",
          label: 'useMediaQuery("md")',
          query: useMediaQuery("md"),
        },
        {
          description: "≥ 1024px",
          label: 'useMediaQuery("lg")',
          query: useMediaQuery("lg"),
        },
        {
          description: "≥ 1280px",
          label: 'useMediaQuery("xl")',
          query: useMediaQuery("xl"),
        },
        {
          description: "≥ 1536px",
          label: 'useMediaQuery("2xl")',
          query: useMediaQuery("2xl"),
        },
      ],
      title: "Min-width (breakpoint and above)",
    },
    {
      rows: [
        {
          description: "< 640px",
          label: 'useMediaQuery("max-sm")',
          query: useMediaQuery("max-sm"),
        },
        {
          description: "< 800px",
          label: 'useMediaQuery("max-md")',
          query: useMediaQuery("max-md"),
        },
        {
          description: "< 1024px",
          label: 'useMediaQuery("max-lg")',
          query: useMediaQuery("max-lg"),
        },
      ],
      title: "Max-width (below breakpoint)",
    },
    {
      rows: [
        {
          description: "640 - 799px",
          label: 'useMediaQuery("sm:max-md")',
          query: useMediaQuery("sm:max-md"),
        },
        {
          description: "800 - 1023px",
          label: 'useMediaQuery("md:max-lg")',
          query: useMediaQuery("md:max-lg"),
        },
        {
          description: "1024 - 1279px",
          label: 'useMediaQuery("lg:max-xl")',
          query: useMediaQuery("lg:max-xl"),
        },
      ],
      title: "Ranges",
    },
    {
      rows: [
        {
          description: "touch",
          label: 'useMediaQuery({ pointer: "coarse" })',
          query: useMediaQuery({ pointer: "coarse" }),
        },
        {
          description: "mouse",
          label: 'useMediaQuery({ pointer: "fine" })',
          query: useMediaQuery({ pointer: "fine" }),
        },
        {
          label: 'useMediaQuery("(prefers-color-scheme: dark)")',
          query: useMediaQuery("(prefers-color-scheme: dark)"),
        },
        {
          label: 'useMediaQuery("(prefers-reduced-motion: reduce)")',
          query: useMediaQuery("(prefers-reduced-motion: reduce)"),
        },
      ],
      title: "Device & preferences",
    },
  ];
</script>

<div class="my-8 flex flex-col gap-6" data-testid="media-query-demo">
  {#each sections as section (section.title)}
    <section>
      <h3 class="mb-2 font-medium text-sm">{section.title}</h3>
      <ul class="m-0 divide-y rounded-xl border text-foreground">
        {#each section.rows as row (row.label)}
          <li class="mt-0 flex items-center justify-between gap-2 px-3 py-2.5">
            <code
              class="relative break-all rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[.8125rem] text-muted-foreground outline-none"
            >
              {row.label}
            </code>
            <div class="flex shrink-0 items-center gap-2">
              {#if row.description}
                <span class="ms-2 text-muted-foreground text-xs">{row.description}</span>
              {/if}
              <Badge
                class={[
                  "min-w-11 shrink-0 rounded-full text-xs sm:h-6 sm:min-w-11",
                  !row.query.current && "text-muted-foreground",
                ]}
                variant={row.query.current ? "success" : "secondary"}
              >
                {row.query.current ? "true" : "false"}
              </Badge>
            </div>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>
