<script module lang="ts">
  import type { NumberFieldStepButtonProps } from "./number-field-step-button.svelte";
  export type NumberFieldIncrementProps = Omit<NumberFieldStepButtonProps, "direction">;
</script>

<script lang="ts">
  import StepButton from "./number-field-step-button.svelte";

  let { ref = $bindable(null), ...props }: NumberFieldIncrementProps = $props();
</script>

<StepButton bind:ref direction={1} {...props} />
