<script lang="ts">
  import NativeWrapper from "./native-wrapper.svelte";

  let count = $state(0);
</script>

<NativeWrapper aria-label="Increment" data-forwarded="yes" onclick={() => (count += 1)}>
  Increment
</NativeWrapper>
<output aria-live="polite">{count}</output>
