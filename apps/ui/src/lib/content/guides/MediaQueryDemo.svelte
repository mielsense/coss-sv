<script lang="ts">
  import { Badge } from "@coss-sv/ui";
  import { MediaQuery } from "svelte/reactivity";

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
          label: 'new MediaQuery("(min-width: 640px)")',
          query: new MediaQuery("(min-width: 640px)", false),
        },
        {
          description: "≥ 800px",
          label: 'new MediaQuery("(min-width: 800px)")',
          query: new MediaQuery("(min-width: 800px)", false),
        },
        {
          description: "≥ 1024px",
          label: 'new MediaQuery("(min-width: 1024px)")',
          query: new MediaQuery("(min-width: 1024px)", false),
        },
        {
          description: "≥ 1280px",
          label: 'new MediaQuery("(min-width: 1280px)")',
          query: new MediaQuery("(min-width: 1280px)", false),
        },
        {
          description: "≥ 1536px",
          label: 'new MediaQuery("(min-width: 1536px)")',
          query: new MediaQuery("(min-width: 1536px)", false),
        },
      ],
      title: "Min-width (breakpoint and above)",
    },
    {
      rows: [
        {
          description: "< 640px",
          label: 'new MediaQuery("(max-width: 639px)")',
          query: new MediaQuery("(max-width: 639px)", false),
        },
        {
          description: "< 800px",
          label: 'new MediaQuery("(max-width: 799px)")',
          query: new MediaQuery("(max-width: 799px)", false),
        },
        {
          description: "< 1024px",
          label: 'new MediaQuery("(max-width: 1023px)")',
          query: new MediaQuery("(max-width: 1023px)", false),
        },
      ],
      title: "Max-width (below breakpoint)",
    },
    {
      rows: [
        {
          description: "640 - 799px",
          label: 'new MediaQuery("(min-width: 640px) and (max-width: 799px)")',
          query: new MediaQuery("(min-width: 640px) and (max-width: 799px)", false),
        },
        {
          description: "800 - 1023px",
          label: 'new MediaQuery("(min-width: 800px) and (max-width: 1023px)")',
          query: new MediaQuery("(min-width: 800px) and (max-width: 1023px)", false),
        },
        {
          description: "1024 - 1279px",
          label: 'new MediaQuery("(min-width: 1024px) and (max-width: 1279px)")',
          query: new MediaQuery("(min-width: 1024px) and (max-width: 1279px)", false),
        },
      ],
      title: "Ranges",
    },
    {
      rows: [
        {
          description: "touch",
          label: 'new MediaQuery("(pointer: coarse)")',
          query: new MediaQuery("(pointer: coarse)", false),
        },
        {
          description: "mouse",
          label: 'new MediaQuery("(pointer: fine)")',
          query: new MediaQuery("(pointer: fine)", false),
        },
        {
          label: 'new MediaQuery("(prefers-color-scheme: dark)")',
          query: new MediaQuery("(prefers-color-scheme: dark)", false),
        },
        {
          label: 'new MediaQuery("(prefers-reduced-motion: reduce)")',
          query: new MediaQuery("(prefers-reduced-motion: reduce)", false),
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
