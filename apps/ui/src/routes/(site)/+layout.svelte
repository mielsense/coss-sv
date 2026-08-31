<script lang="ts">
  import { page } from "$app/state";
  import { SiteFooter, SiteHeader } from "@/site/index.js";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
  const isDocs = $derived(page.url.pathname === "/docs" || page.url.pathname.startsWith("/docs/"));
  const showGlobalFooter = $derived(!isDocs && page.status < 400);
</script>

<div class="site-shell">
  <SiteHeader />
  <main class="min-h-[calc(100vh-8.5rem)]">
    {@render children()}
  </main>
  {#if showGlobalFooter}<SiteFooter />{/if}
</div>
