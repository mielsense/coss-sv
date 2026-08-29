<script module lang="ts">
  import type { Combobox as P } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type ComboboxEmptyProps = ComponentProps<typeof P.Empty>;
</script>

<script lang="ts">
  import Part from "./combobox-parts.svelte";
  let { ref = $bindable(null), ...props }: ComboboxEmptyProps = $props();
</script>

<Part bind:ref kind="empty" {...props} />
