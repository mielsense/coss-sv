<script lang="ts">
import { primaryNavigation } from "./site.js";
</script>

<header class="site-header">
  <a class="site-brand" href="/">COSS for Svelte</a>
  <nav class="site-nav" aria-label="Primary navigation">
    {#each primaryNavigation as item (item.href)}
      <a href={item.href}>{item.label}</a>
    {/each}
  </nav>
</header>
