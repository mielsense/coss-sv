<script lang="ts">
  import type { Snippet } from "svelte";
  import { DocsSidebar, DocsToc, SiteFooter } from "$lib/site/index.js";

  let { children }: { children: Snippet } = $props();
</script>

<div class="docs-layout">
  <DocsSidebar />
  <div class="docs-column">
    <div class="docs-frame">
      <div class="docs-card">
        <div class="docs-card-panel docs-content">
          {@render children()}
        </div>
      </div>
      <div class="docs-frame-footer">
        <SiteFooter embedded />
      </div>
    </div>
  </div>
  <DocsToc />
</div>
