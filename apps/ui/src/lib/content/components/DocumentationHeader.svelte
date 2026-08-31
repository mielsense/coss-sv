<script lang="ts">
  import LinkSquare02Icon from "@hugeicons/core-free-icons/LinkSquare02Icon";
  import { buttonVariants, HugeiconsIcon } from "@coss-sv/ui";
  import type { PageMetadata } from "../compiler.js";
  import CopyMarkdownButton from "../guides/CopyMarkdownButton.svelte";

  let {
    markdownUrl,
    metadata,
  }: {
    markdownUrl: string;
    metadata: PageMetadata;
  } = $props();
</script>

<header class="mx-auto flex w-full max-w-3xl flex-col gap-2" data-docs-header>
  <div class="flex flex-col gap-2">
    <h1
      class="m-0 font-heading text-3xl leading-9 font-bold min-[80rem]:text-4xl min-[80rem]:leading-10"
    >
      {metadata.title}
    </h1>
    <p class="m-0 text-muted-foreground leading-6 sm:text-lg sm:leading-7">
      {metadata.description}
    </p>
  </div>
  <div class="flex items-center gap-2 pt-4">
    {#if metadata.links?.doc}
      <a
        class={buttonVariants({ size: "xs", variant: "outline" })}
        href={metadata.links.doc}
        rel="noreferrer"
        target="_blank"
      >
        <HugeiconsIcon aria-hidden="true" icon={LinkSquare02Icon} strokeWidth={2.5} />
        API Reference
      </a>
    {/if}
    <CopyMarkdownButton url={markdownUrl} />
  </div>
</header>
