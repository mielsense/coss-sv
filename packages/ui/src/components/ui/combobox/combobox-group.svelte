<script module lang="ts">
  import type { Combobox as P } from "@shardsui/svelte/combobox";
  import type { ComponentProps } from "svelte";
  export type ComboboxGroupProps = ComponentProps<typeof P.Group>;
</script>

<script lang="ts">
  import Part from "./combobox-parts.svelte";
  let { ref = $bindable(null), ...props }: ComboboxGroupProps = $props();
</script>

<Part bind:ref kind="group" {...props} />
