<script module lang="ts">
  import type { Combobox as P } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type ComboboxRowProps = ComponentProps<typeof P.Row>;
</script>

<script lang="ts">
  import Part from "./combobox-parts.svelte";
  let { ref = $bindable(null), ...props }: ComboboxRowProps = $props();
</script>

<Part bind:ref kind="row" {...props} />
