<script lang="ts">
  import Label from "./label.svelte";

  let checked = $state(false);
  let labelRef = $state<HTMLElement | null>(null);
</script>

<Label bind:ref={labelRef} data-testid="native-label" for="choice">Choose</Label>
<input bind:checked id="choice" type="checkbox" />
<output data-testid="label-state">{checked}:{labelRef?.tagName ?? "missing"}</output>
