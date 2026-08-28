<script lang="ts">
import ToggleGroupDocs from "$content/docs/components/toggle-group.svx";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.documentation.metadata.title} | COSS for Svelte</title>
  <meta name="description" content={data.documentation.metadata.description}>
</svelte:head>

<article class="content-page grid-cols-[minmax(0,1fr)]">
  <h1>{data.documentation.metadata.title}</h1>
  <p>{data.documentation.metadata.description}</p>
  {#if data.documentation.metadata.links?.doc}
    <p><a class="site-button" href={data.documentation.metadata.links.doc}>API reference</a></p>
  {/if}
  <ToggleGroupDocs />
</article>
