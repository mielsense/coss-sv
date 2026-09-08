<script lang="ts">
  import { buttonVariants, HugeiconsIcon } from "@coss-sv/ui";
  import ContrastIcon from "@hugeicons/core-free-icons/ContrastIcon";
  import GithubIcon from "@hugeicons/core-free-icons/GithubIcon";
  import { onMount } from "svelte";
  import { page } from "$app/state";
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
      class="flex shrink-0 items-center gap-1.5 font-heading text-2xl leading-8 font-bold [font-variation-settings:'GEOM'_50,'opsz'_32]"
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
            class={buttonVariants({ variant: "ghost", class: "no-underline" })}
            href={item.href}
            aria-current={page.url.pathname.startsWith(item.href) ? "page" : undefined}
            data-pressed={page.url.pathname.startsWith(item.href) ? "true" : undefined}
            >{item.label}</a
          >
        {/each}
      </nav>
      <div class="mx-2 hidden md:block"><CommandMenu /></div>
      <span class="hidden h-5 w-px bg-site-border md:block" aria-hidden="true"></span>
      <a
        class={buttonVariants({
          size: "sm",
          variant: "ghost",
          class: "no-underline shadow-none max-sm:w-8",
        })}
        href={repositoryUrl}
        aria-label="COSS for Svelte repository"
      >
        <HugeiconsIcon aria-hidden="true" icon={GithubIcon} strokeWidth={2} />
        <span class="hidden sm:inline">0</span>
      </a>
      <button
        class={buttonVariants({ size: "icon", variant: "ghost", class: "size-8" })}
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
