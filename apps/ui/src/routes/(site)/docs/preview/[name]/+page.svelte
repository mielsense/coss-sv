<script lang="ts">
  import { page } from "$app/state";
  import { ContentPage, PreviewPresentation } from "@/site/index.js";

  let name = $derived(page.params.name ?? "");
</script>

<svelte:head>
  <title>{name} preview - COSS for Svelte</title>
</svelte:head>

<ContentPage>
  <h1>{name} preview</h1>
  <PreviewPresentation {name} title={name} />
</ContentPage>
