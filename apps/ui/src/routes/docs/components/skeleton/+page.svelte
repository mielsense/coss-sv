<script lang="ts">
import Skeleton from "$content/docs/components/skeleton.svx";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.documentation.metadata.title} | COSS for Svelte</title>
  <meta name="description" content={data.documentation.metadata.description}>
</svelte:head>

<article class="content-page">
  <h1>{data.documentation.metadata.title}</h1>
  <p>{data.documentation.metadata.description}</p>
  <Skeleton />
</article>
