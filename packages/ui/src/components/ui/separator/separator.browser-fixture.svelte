<script lang="ts">
import Separator from "./separator.svelte";

let clicks = $state(0);
let separatorRef = $state<HTMLElement | null>(null);
</script>

<Separator
  aria-label="Interactive divider"
  as="section"
  bind:ref={separatorRef}
  class="bg-red-500 data-[orientation=horizontal]:h-4"
  data-forwarded="yes"
  data-testid="interactive-separator"
  onclick={() => (clicks += 1)}
  orientation="vertical"
  tabindex={0}
>
  <span data-testid="separator-snippet">between sections</span>
</Separator>

<Separator aria-label="Default divider" data-testid="shards-separator" />

<output data-testid="separator-state">{clicks}:{separatorRef?.tagName ?? "missing"}</output>
