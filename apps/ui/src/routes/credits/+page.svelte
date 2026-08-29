<script lang="ts">
  import { authorUrl, upstreamUrl } from "$lib/site/site.js";
</script>

<svelte:head>
  <title>Credits | COSS for Svelte</title>
  <meta name="description" content="Project credits and license links for COSS for Svelte." />
</svelte:head>

<article class="content-page">
  <p class="eyebrow">Project record</p>
  <h1>Credits</h1>
  <p>
    COSS for Svelte adapts the MIT-licensed <code>reference/apps/ui</code> documentation and
    registry sources from <a href={upstreamUrl}>COSS</a>. The pinned source revision is
    <a href={`${upstreamUrl}/tree/19620ae8cae81e30775f2cde03829326cb4916b2/apps/ui`}
      ><code>19620ae8cae81e30775f2cde03829326cb4916b2</code></a
    >.
  </p>
  <p>Unofficial Svelte port made by <a href={authorUrl}>Miel</a>.</p>
  <p>
    This is an independent project and is not endorsed by COSS. COSS and its contributors retain
    their respective rights in the adapted source.
  </p>
  <h2>Legal files</h2>
  <ul>
    <li><a href="/LICENSE">License</a></li>
    <li><a href="/NOTICE.md">Upstream notice</a></li>
    <li><a href="/THIRD_PARTY_NOTICES.md">Third-party notices</a></li>
  </ul>
</article>
