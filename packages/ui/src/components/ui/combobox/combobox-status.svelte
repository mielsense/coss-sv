<script module lang="ts">
  import type { Combobox as P } from "@shardsui/svelte/combobox";
  import type { ComponentProps } from "svelte";
  export type ComboboxStatusProps = ComponentProps<typeof P.Status>;
</script>

<script lang="ts">
  import Part from "./combobox-parts.svelte";
  let { ref = $bindable(null), ...props }: ComboboxStatusProps = $props();
</script>

<Part bind:ref kind="status" {...props} />
