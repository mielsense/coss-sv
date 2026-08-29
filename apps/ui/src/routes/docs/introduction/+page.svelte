<script lang="ts">
  import Introduction from "$content/docs/introduction.svx";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.documentation.metadata.title} | COSS for Svelte</title>
  <meta name="description" content={data.documentation.metadata.description} />
</svelte:head>

<article class="content-page">
  <Introduction />
</article>
