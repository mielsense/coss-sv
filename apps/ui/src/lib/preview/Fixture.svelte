<script lang="ts">
  const instanceId = $props.id();
  const headingId = `${instanceId}-heading`;
  let count = $state(0);
</script>

<section
  class="w-[min(32rem,100%)] rounded-xl border border-border bg-card p-6 font-sans text-foreground [&_h1]:m-0 [&_p]:m-0 [&_p]:mt-2 [&_p]:text-foreground/70"
  aria-labelledby={headingId}
  data-hydration-id={instanceId}
  data-preview-fixture="true"
>
  <h1 id={headingId}>Preview fixture</h1>
  <p>Deterministic content for the shared browser checks.</p>
  <div class="mt-4 flex items-center gap-4">
    <button
      class="min-h-11 rounded-lg border border-border bg-primary px-3 py-2 text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
      type="button"
      onclick={() => (count += 1)}>Advance count</button
    >
    <output aria-live="polite">Count: {count}</output>
  </div>
  <div
    class="mt-4 size-2 animate-[preview-fixture-motion_2s_linear_infinite] rounded-full bg-current motion-reduce:animate-none"
    data-motion-probe="true"
    aria-hidden="true"
  ></div>
</section>

<style>
  @keyframes -global-preview-fixture-motion {
    to {
      transform: translateX(2rem);
    }
  }
</style>
