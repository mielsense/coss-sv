<script lang="ts">
  import type { Snippet } from "svelte";
  import "./preview.css";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="preview-canvas" data-preview-canvas="true">
  {@render children()}
</main>
