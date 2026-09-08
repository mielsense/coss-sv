<script lang="ts">
  import { page } from "$app/state";
  import { SiteFooter, SiteHeader } from "@/site/index.js";
  import type { LayoutProps } from "./$types";

  let { children, data }: LayoutProps = $props();
  const isDocs = $derived(page.url.pathname === "/docs" || page.url.pathname.startsWith("/docs/"));
  const showGlobalFooter = $derived(!isDocs && page.status < 400);
</script>

<svelte:head>
  <script
    async
    src="https://c.getopen.so/oa.js"
    data-key="oa_pk_11Sw2rumK1oklXTuAoGNhj-pVIhv9cab"
    data-collector="https://c.getopen.so"
  ></script>
</svelte:head>

<div class="site-shell">
  <SiteHeader repositoryStars={data.repositoryStars} />
  <main class="min-h-[calc(100vh-8.5rem)]">
    {@render children()}
  </main>
  {#if showGlobalFooter}<SiteFooter />{/if}
</div>
