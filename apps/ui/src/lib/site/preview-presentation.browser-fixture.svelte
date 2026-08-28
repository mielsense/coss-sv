<script lang="ts">
import "../../app.css";
import type { PreviewTheme } from "../../routes/preview/[name]/preview-contract.js";
import PreviewPresentation from "./PreviewPresentation.svelte";

let { theme }: { theme?: PreviewTheme } = $props();
</script>

<div class="site-shell">
  {#if theme}
    <PreviewPresentation name="p-button-1" title="Button" {theme} />
  {:else}
    <PreviewPresentation name="p-button-1" title="Button" />
  {/if}
</div>
