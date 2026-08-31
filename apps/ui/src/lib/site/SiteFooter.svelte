<script lang="ts">
  import { authorUrl } from "./site.js";

  let { embedded = false }: { embedded?: boolean } = $props();
</script>

<footer
  class={[
    "relative py-6 text-site-muted leading-6 before:absolute before:inset-x-0 before:top-0 before:z-1 before:h-px before:bg-site-border-soft",
    embedded ? "m-0 px-4 before:hidden lg:px-8" : "mt-8",
  ]}
  data-embedded={embedded || undefined}
  data-site-footer
>
  {#if !embedded}<div class="frame-markers" aria-hidden="true"></div>{/if}
  <div
    class={[
      "flex items-start justify-between gap-4 max-sm:flex-col sm:items-center",
      embedded ? "w-full max-w-none p-0" : "site-container",
    ]}
    data-site-footer-inner
  >
    <div>
      <p class="m-0">
        <a
          class="font-heading text-lg text-site-foreground font-bold no-underline [font-variation-settings:'GEOM'_50,'opsz'_32] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3"
          href="/">coss.com <span class="text-site-muted/72">ui</span></a
        >
      </p>
      <p class="m-0 text-sm leading-5">
        Unofficial Svelte port made by
        <a
          class="underline underline-offset-[0.22em] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3"
          href={authorUrl}
          rel="noreferrer"
          target="_blank">Miel</a
        >. Based on the open-source
        <a
          class="underline underline-offset-[0.22em] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3"
          href="https://coss.com/ui">COSS UI</a
        >
        project.
      </p>
    </div>
    <a
      class="shrink-0 text-sm underline underline-offset-[0.22em] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3"
      href="/credits">Credits and licenses</a
    >
  </div>
</footer>
