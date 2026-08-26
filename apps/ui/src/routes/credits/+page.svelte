<script lang="ts">
import { authorUrl, upstreamUrl } from "$lib/site/site.js";
</script>

<svelte:head>
  <title>Credits | COSS for Svelte</title>
  <meta name="description" content="Project credits and license links for COSS for Svelte.">
</svelte:head>

<article class="content-page">
  <p class="eyebrow">Project record</p>
  <h1>Credits</h1>
  <p>
    COSS for Svelte adapts the MIT-licensed documentation and registry sources from
    <a href={upstreamUrl}>COSS</a>. It is an independent port and is not endorsed by COSS.
  </p>
  <p>The Svelte port was made by <a href={authorUrl}>Miel</a>.</p>
  <h2>Legal files</h2>
  <ul>
    <li><a href="/LICENSE">License</a></li>
    <li><a href="/NOTICE.md">Upstream notice</a></li>
    <li><a href="/THIRD_PARTY_NOTICES.md">Third-party notices</a></li>
  </ul>
</article>
