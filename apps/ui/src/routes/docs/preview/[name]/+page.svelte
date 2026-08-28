<script lang="ts">
import { page } from "$app/state";
import { PreviewPresentation } from "$lib/site/index.js";

let name = $derived(page.params.name ?? "");
</script>

<svelte:head>
  <title>{name} preview - COSS for Svelte</title>
</svelte:head>

<article class="content-page">
  <h1>{name} preview</h1>
  <PreviewPresentation {name} title={name} />
</article>
