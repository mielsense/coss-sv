<script lang="ts">
  import Guide from "$content/docs/hooks-use-media-query.svx";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.documentation.metadata.title} | COSS for Svelte</title>
  <meta name="description" content={data.documentation.metadata.description} />
</svelte:head>

<article class="content-page">
  <Guide />
</article>
