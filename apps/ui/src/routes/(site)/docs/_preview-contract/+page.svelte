<script lang="ts">
  import PreviewCard from "@/content/components/PreviewCard.svelte";
  import Fixture from "@/preview/Fixture.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>PreviewCard contract</title>
</svelte:head>

<main>
  <PreviewCard
    align="start"
    component={Fixture}
    data-preview-contract="interactive"
    name="_fixture"
    source={data.source}
    title="Interactive contract"
    width="mobile"
  />
  <PreviewCard
    component={Fixture}
    data-preview-contract="hidden-code"
    hideCode
    name="_fixture"
    source={data.source}
    theme="light"
    title="Hidden code contract"
    width="tablet"
  />
</main>
