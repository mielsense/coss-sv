<script lang="ts">
  import { authorUrl } from "./site.js";

  let { embedded = false }: { embedded?: boolean } = $props();
</script>

<footer class="site-footer" data-embedded={embedded || undefined}>
  <div class="frame-markers" aria-hidden="true"></div>
  <div class="site-container footer-inner">
    <div>
      <p>
        <a href="/">coss.com <span>ui</span></a>
      </p>
      <p>
        Unofficial Svelte port made by
        <a href={authorUrl} rel="noreferrer" target="_blank">Miel</a>. Based on the open-source
        <a href="https://coss.com/ui">COSS UI</a>
        project.
      </p>
    </div>
    <a class="footer-credits" href="/credits">Credits and licenses</a>
  </div>
</footer>
