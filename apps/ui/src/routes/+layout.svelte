<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import "@coss-sv/ui/styles/globals.css";
  import "../tailwind.css";
  import "../app.css";
  import { SiteFooter, SiteHeader } from "$lib/site/index.js";

  let { children }: { children: Snippet } = $props();
  let isPreview = $derived(page.url.pathname.startsWith("/preview"));
  let isDocs = $derived(page.url.pathname === "/docs" || page.url.pathname.startsWith("/docs/"));
  let showGlobalFooter = $derived(!isDocs && page.status < 400);
</script>

{#if isPreview}
  {@render children()}
{:else}
  <div class="site-shell">
    <SiteHeader />
    <main class="site-main">
      {@render children()}
    </main>
    {#if showGlobalFooter}
      <SiteFooter />
    {/if}
  </div>
{/if}
