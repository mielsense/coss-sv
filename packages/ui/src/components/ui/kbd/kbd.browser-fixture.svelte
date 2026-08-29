<script lang="ts">
  import { Kbd, KbdGroup } from "./index.js";

  let clicks = $state(0);
  let groupRef = $state<HTMLElement | null>(null);
  let keyRef = $state<HTMLElement | null>(null);
</script>

<KbdGroup bind:ref={groupRef} data-testid="kbd-group" onclick={() => (clicks += 1)}>
  <Kbd bind:ref={keyRef}>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>

<output data-testid="kbd-state"
  >{clicks}:{groupRef?.tagName ?? "missing"}:{keyRef?.tagName ?? "missing"}</output
>
