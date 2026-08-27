<script lang="ts">
import { Separator } from "@coss-sv/ui";
</script>

<div class="separator-example">
  <div class="separator-copy">
    <h4>coss ui</h4>
    <p>Unstyled, accessible primitives for fast product UI and design systems.</p>
  </div>
  <Separator class="my-4" />
  <div class="separator-links">
    <div>Blog</div>
    <Separator orientation="vertical" />
    <div>Docs</div>
    <Separator orientation="vertical" />
    <div>Source</div>
    <Separator orientation="vertical" />
    <div>Releases</div>
  </div>
</div>

<style>
.separator-example {
  width: 100%;
  max-width: 18rem;
}

.separator-copy {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.separator-copy h4,
.separator-copy p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.separator-copy h4 {
  font-weight: 500;
}

.separator-copy p {
  color: var(--muted-foreground);
}

.separator-links {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.separator-example :global([data-slot="separator"]) {
  flex-shrink: 0;
  background: var(--border);
}

.separator-example > :global([data-orientation="horizontal"]) {
  width: 100%;
  height: 1px;
  margin-block: 1rem;
}

.separator-links :global([data-orientation="vertical"]) {
  align-self: stretch;
  width: 1px;
}
</style>
