<script lang="ts">
import CommandMenu from "./CommandMenu.svelte";
import MobileNav from "./MobileNav.svelte";
import { primaryNavigation, upstreamUrl } from "./site.js";

let isDark = $state(false);

function setTheme(nextDark: boolean) {
  isDark = nextDark;
  document.documentElement.classList.toggle("dark", nextDark);
  document.documentElement.classList.toggle("light", !nextDark);
  localStorage.setItem("coss-sv-theme", nextDark ? "dark" : "light");
}

function toggleTheme() {
  setTheme(!isDark);
}

$effect(() => {
  const stored = localStorage.getItem("coss-sv-theme");
  const nextDark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(nextDark);
});
</script>

<header class="site-header">
  <div class="site-container header-inner">
    <MobileNav />
    <div class="site-wordmark">
      <a class="site-brand" href="/" aria-label="COSS for Svelte home">coss.com</a>
      <span aria-hidden="true">sv</span>
    </div>
    <div class="header-actions">
      <nav class="site-nav" aria-label="Primary navigation">
        {#each primaryNavigation as item (item.href)}
          <a href={item.href}>{item.label}</a>
        {/each}
      </nav>
      <CommandMenu />
      <span class="header-separator" aria-hidden="true"></span>
      <a class="upstream-link" href={upstreamUrl} aria-label="COSS upstream repository">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M12 2.8a9.3 9.3 0 0 0-2.94 18.13c.47.09.64-.2.64-.45v-1.8c-2.62.57-3.17-1.11-3.17-1.11-.43-1.09-1.05-1.38-1.05-1.38-.86-.59.06-.58.06-.58.95.07 1.45.98 1.45.98.85 1.44 2.22 1.03 2.76.79.09-.61.33-1.03.6-1.27-2.09-.24-4.29-1.05-4.29-4.66 0-1.03.37-1.87.98-2.53-.1-.24-.43-1.2.09-2.5 0 0 .8-.25 2.56.97A8.9 8.9 0 0 1 12 7.08a8.9 8.9 0 0 1 2.34.31c1.77-1.22 2.56-.97 2.56-.97.52 1.3.19 2.26.09 2.5.61.66.98 1.5.98 2.53 0 3.62-2.2 4.41-4.3 4.65.34.3.64.86.64 1.73v2.65c0 .25.17.55.65.45A9.3 9.3 0 0 0 12 2.8Z"
          />
        </svg>
        <span>10.4k</span>
      </a>
      <button class="theme-toggle" type="button" onclick={toggleTheme} aria-label="Toggle theme">
        <svg aria-hidden="true" data-theme-glyph="contrast" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
          <path class="theme-glyph-fill" d="M12 4a8 8 0 0 0 0 16Z" />
        </svg>
      </button>
    </div>
  </div>
</header>
