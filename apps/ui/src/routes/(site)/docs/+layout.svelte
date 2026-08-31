<script lang="ts">
  import { page } from "$app/state";
  import * as Card from "@coss-sv/ui/components/ui/card";
  import DocumentationHeader from "@/content/components/DocumentationHeader.svelte";
  import type { DocumentationPageData } from "@/content/compiler.js";
  import type { Snippet } from "svelte";
  import { ContentPage, DocsSidebar, DocsToc, SiteFooter } from "@/site/index.js";

  let { children }: { children: Snippet } = $props();
  const documentation = $derived(page.data.documentation as DocumentationPageData | undefined);
  const markdownUrl = $derived(
    page.url.pathname === "/docs" ? "/docs/index.md" : `${page.url.pathname.replace(/\/$/, "")}.md`,
  );
</script>

<svelte:head>
  {#if documentation}
    <title>{documentation.metadata.title} | COSS for Svelte</title>
    <meta name="description" content={documentation.metadata.description} />
  {/if}
</svelte:head>

<div
  class="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[88.5rem] grid-cols-[minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)] min-[80rem]:grid-cols-[15rem_minmax(0,1fr)_18rem]"
  data-docs-layout
>
  <DocsSidebar />
  <div class="min-w-0 lg:m-8 lg:mx-4" data-docs-column>
    <Card.Frame
      class="min-w-0 border-sidebar-border shadow-lg/5 max-lg:border-none dark:bg-background"
      data-docs-frame
    >
      <Card.Root class="min-w-0 max-lg:rounded-none! max-lg:[clip-path:none]! dark:bg-background">
        <Card.Panel class="docs-content flex flex-col gap-8 p-6 sm:px-6 lg:p-8">
          {#if documentation}
            <DocumentationHeader {markdownUrl} metadata={documentation.metadata} />
          {/if}
          {#if documentation}
            <ContentPage mode="docs">{@render children()}</ContentPage>
          {:else}
            {@render children()}
          {/if}
        </Card.Panel>
      </Card.Root>
      <div>
        <SiteFooter embedded />
      </div>
    </Card.Frame>
  </div>
  <DocsToc items={documentation?.tableOfContents ?? []} />
</div>
