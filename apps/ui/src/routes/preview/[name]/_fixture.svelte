<script lang="ts">
const instanceId = $props.id();
const headingId = `${instanceId}-heading`;
let count = $state(0);
</script>

<section
  class="fixture"
  aria-labelledby={headingId}
  data-hydration-id={instanceId}
  data-preview-fixture="true"
>
  <h1 id={headingId}>Preview fixture</h1>
  <p>Deterministic content for the shared browser checks.</p>
  <div class="controls">
    <button type="button" onclick={() => (count += 1)}>Advance count</button>
    <output aria-live="polite">Count: {count}</output>
  </div>
</section>

<style>
.fixture {
  width: min(32rem, 100%);
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background-color: Canvas;
  color: var(--foreground);
  font-family: ui-sans-serif, system-ui, sans-serif;
}

h1,
p {
  margin: 0;
}

p {
  margin-top: 0.5rem;
  color: color-mix(in srgb, currentColor 70%, transparent);
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--primary);
  color: var(--primary-foreground);
  font: inherit;
}

button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
</style>
