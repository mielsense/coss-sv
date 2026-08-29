<script lang="ts">
  import { ContrastIcon, GithubIcon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { page } from "$app/state";
  import CommandMenu from "./CommandMenu.svelte";
  import MobileNav from "./MobileNav.svelte";
  import { primaryNavigation, upstreamUrl } from "./site.js";

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

<header class="site-header">
  <div class="header-markers" aria-hidden="true"></div>
  <div class="site-container header-inner">
    <MobileNav />
    <div class="site-wordmark">
      <a class="site-brand" href="/" aria-label="Home">coss.com</a>
      <span aria-hidden="true">ui</span>
    </div>
    <div class="header-actions">
      <nav class="site-nav" aria-label="Primary navigation">
        {#each primaryNavigation as item (item.href)}
          <a
            href={item.href}
            aria-current={page.url.pathname.startsWith(item.href) ? "page" : undefined}
            data-pressed={page.url.pathname.startsWith(item.href) ? "true" : undefined}
            >{item.label}</a
          >
        {/each}
      </nav>
      <CommandMenu />
      <span class="header-separator" aria-hidden="true"></span>
      <a class="upstream-link" href={upstreamUrl} aria-label="COSS upstream repository">
        <HugeiconsIcon aria-hidden="true" icon={GithubIcon} strokeWidth={2} />
        <span>10.4k</span>
      </a>
      <button class="theme-toggle" type="button" onclick={toggleTheme} aria-label="Toggle theme">
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
