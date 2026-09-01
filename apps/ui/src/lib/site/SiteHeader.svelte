<script lang="ts">
  import ContrastIcon from "@hugeicons/core-free-icons/ContrastIcon";
  import GithubIcon from "@hugeicons/core-free-icons/GithubIcon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import CommandMenu from "./CommandMenu.svelte";
  import MobileNav from "./MobileNav.svelte";
  import { primaryNavigation, repositoryUrl } from "./site.js";

  let hydrated = $state(false);

  onMount(() => {
    hydrated = true;
  });

  function setTheme(nextDark: boolean) {
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
    localStorage.setItem("coss-sv-theme", nextDark ? "dark" : "light");
    document.dispatchEvent(new Event("coss-sv:themechange"));
  }

  function toggleTheme() {
    setTheme(!document.documentElement.classList.contains("dark"));
  }
</script>

<header
  class="sticky top-0 z-40 h-16 w-full border-site-border-soft border-b bg-site-background/80 backdrop-blur-sm"
>
  <div class="header-markers" aria-hidden="true"></div>
  <div class="site-container relative flex h-16 items-center justify-between gap-2">
    <MobileNav />
    <div
      class="flex shrink-0 items-center gap-1.5 font-heading text-[1.375rem] leading-8 font-bold [font-variation-settings:'GEOM'_50,'opsz'_32]"
    >
      <a
        class="no-underline focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3"
        href="/"
        aria-label="Home">coss.com</a
      >
      <span class="text-site-muted/64" aria-hidden="true">ui</span>
      <span
        class="inline-flex min-h-5.5 items-center rounded-md bg-[#ff3e00] px-2 font-sans text-site-foreground text-[0.6875rem] leading-none font-[650] tracking-[-0.01em]"
        >Svelte</span
      >
    </div>
    <div class="ms-auto flex min-w-0 items-center justify-end gap-2">
      <nav class="hidden items-center gap-2 text-sm lg:flex" aria-label="Primary navigation">
        {#each primaryNavigation as item (item.href)}
          <a
            class="inline-flex min-h-8 items-center justify-center rounded-lg border border-transparent bg-transparent px-2.5 font-medium no-underline hover:bg-site-foreground/4 focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3 aria-[current=page]:text-site-primary data-[pressed=true]:bg-site-foreground/4"
            href={item.href}
            aria-current={page.url.pathname.startsWith(item.href) ? "page" : undefined}
            data-pressed={page.url.pathname.startsWith(item.href) ? "true" : undefined}
            >{item.label}</a
          >
        {/each}
      </nav>
      <CommandMenu />
      <span class="ms-2 hidden h-5 w-px bg-site-border md:block" aria-hidden="true"></span>
      <a
        class="inline-flex min-h-8 w-8 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-transparent p-0 text-site-muted text-[0.8125rem] no-underline hover:bg-site-foreground/4 focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3 sm:w-auto sm:px-2 [&_svg]:size-4"
        href={repositoryUrl}
        aria-label="COSS for Svelte repository"
      >
        <HugeiconsIcon aria-hidden="true" icon={GithubIcon} strokeWidth={2} />
        <span class="hidden sm:inline">0</span>
      </a>
      <button
        class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-site-border bg-transparent p-0 shadow-[0_1px_2px_rgb(0_0_0/4%)] hover:bg-site-foreground/4 focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-3 [&_svg]:size-4"
        type="button"
        onclick={toggleTheme}
        aria-label="Toggle theme"
        disabled={!hydrated}
      >
        <HugeiconsIcon
          aria-hidden="true"
          data-theme-glyph="contrast"
          icon={ContrastIcon}
          strokeWidth={2}
        />
      </button>
    </div>
  </div>
</header>
